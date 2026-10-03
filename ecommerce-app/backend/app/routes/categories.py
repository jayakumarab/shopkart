from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.category import Category
from ..schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse], summary="List all categories")
def list_categories(db: Session = Depends(get_db)):
    """Fetch all categories for header navigation and filtering."""
    return db.query(Category).order_by(Category.name.asc()).all()


@router.get("/{category_id}", response_model=CategoryResponse, summary="Get single category by ID")
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a specific category."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED, summary="Create a new category")
def create_category(category_in: CategoryCreate, db: Session = Depends(get_db)):
    """Add a new category."""
    existing = db.query(Category).filter(Category.name.ilike(category_in.name.strip())).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists")

    new_cat = Category(name=category_in.name.strip(), image_url=category_in.image_url)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat


@router.put("/{category_id}", response_model=CategoryResponse, summary="Update an existing category")
def update_category(category_id: int, category_in: CategoryUpdate, db: Session = Depends(get_db)):
    """Update category name or image."""
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    if category_in.name is not None:
        cat.name = category_in.name.strip()
    if category_in.image_url is not None:
        cat.image_url = category_in.image_url

    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{category_id}", status_code=status.HTTP_200_OK, summary="Delete a category")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    """Delete a category by ID."""
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    db.delete(cat)
    db.commit()
    return {"message": "Category deleted successfully"}

