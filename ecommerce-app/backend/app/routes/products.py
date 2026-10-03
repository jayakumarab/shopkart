import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models.product import Product
from ..models.category import Category
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListResponse, summary="List products with filtering, search, sorting & pagination")
def list_products(
    search: Optional[str] = Query(None, description="Search term for product name or description"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    category_name: Optional[str] = Query(None, description="Filter by category name"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating filter"),
    sort: Optional[str] = Query(
        "newest",
        description="Sort by: 'price_asc', 'price_desc', 'rating_desc', or 'newest'"
    ),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(12, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """Retrieve catalog products with full search, category filtering, price/rating range, and sorting."""
    query = db.query(Product).options(joinedload(Product.category))

    # Search filter
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (Product.name.ilike(search_pattern)) |
            (Product.description.ilike(search_pattern))
        )

    # Category filter by ID
    if category_id:
        query = query.filter(Product.category_id == category_id)

    # Category filter by name
    if category_name:
        query = query.join(Product.category).filter(Category.name.ilike(category_name.strip()))

    # Price range filters
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Rating filter
    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)

    # Total count before pagination
    total = query.count()

    # Sorting
    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "rating_desc":
        query = query.order_by(Product.rating.desc(), Product.price.asc())
    else:  # newest / default
        query = query.order_by(Product.created_at.desc(), Product.id.desc())

    # Pagination
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()
    pages = math.ceil(total / limit) if limit > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }


@router.get("/{product_id}", response_model=ProductResponse, summary="Get single product details by ID")
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Retrieve complete product details including category."""
    product = db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, summary="Create a new product")
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    """Add a new product to the catalog."""
    category = db.query(Category).filter(Category.id == product_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specified category does not exist"
        )

    # Compute discount if original_price is provided and discount is not
    original_price = product_in.original_price or product_in.price
    discount = product_in.discount
    if discount is None and original_price > product_in.price:
        discount = round(((original_price - product_in.price) / original_price) * 100, 1)

    new_prod = Product(
        name=product_in.name.strip(),
        description=product_in.description,
        price=product_in.price,
        original_price=original_price,
        discount=discount,
        rating=product_in.rating or 4.0,
        stock=product_in.stock if product_in.stock is not None else 10,
        image_url=product_in.image_url,
        category_id=product_in.category_id
    )
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return new_prod


@router.put("/{product_id}", response_model=ProductResponse, summary="Update an existing product")
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    """Update product information."""
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)
    if "category_id" in update_data:
        cat = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not cat:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category does not exist")

    for field, value in update_data.items():
        setattr(prod, field, value)

    # Recalculate discount if price or original_price changed
    if prod.original_price and prod.original_price > prod.price and not update_data.get("discount"):
        prod.discount = round(((prod.original_price - prod.price) / prod.original_price) * 100, 1)

    db.commit()
    db.refresh(prod)
    return prod


@router.delete("/{product_id}", status_code=status.HTTP_200_OK, summary="Delete a product")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product by ID."""
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    db.delete(prod)
    db.commit()
    return {"message": "Product deleted successfully"}

