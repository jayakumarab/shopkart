from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models.user import User
from ..models.cart import CartItem
from ..models.product import Product
from ..schemas.cart import CartItemCreate, CartItemUpdate, CartSummaryResponse, CartItemResponse
from ..auth.dependencies import get_current_active_user

router = APIRouter(prefix="/cart", tags=["Cart"])


def _calculate_cart_summary(cart_items) -> dict:
    """Helper to compute order amounts, discounts, and delivery charges."""
    formatted_items = []
    total_items = 0
    total_amount = 0.0
    total_original_price = 0.0

    for item in cart_items:
        prod = item.product
        price = prod.price if prod else 0.0
        orig_price = (prod.original_price if (prod and prod.original_price) else price)
        subtotal = round(price * item.quantity, 2)
        total_items += item.quantity
        total_amount += subtotal
        total_original_price += round(orig_price * item.quantity, 2)

        formatted_items.append({
            "id": item.id,
            "user_id": item.user_id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "created_at": item.created_at,
            "product": prod,
            "subtotal": subtotal
        })

    total_discount = round(max(0.0, total_original_price - total_amount), 2)
    # Free delivery on orders ₹500 and above, ₹40 otherwise; ₹0 if empty
    delivery_charge = 0.0 if (total_amount >= 500 or total_items == 0) else 40.0
    final_total = round(total_amount + delivery_charge, 2)

    return {
        "items": formatted_items,
        "total_items": total_items,
        "total_original_price": round(total_original_price, 2),
        "total_discount": total_discount,
        "total_amount": round(total_amount, 2),
        "delivery_charge": delivery_charge,
        "final_total": final_total
    }


@router.get("", response_model=CartSummaryResponse, summary="Get current user's shopping cart")
def get_cart(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve full cart items and pricing summary for the authenticated user."""
    items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.user_id == current_user.id)
        .order_by(CartItem.created_at.desc())
        .all()
    )
    return _calculate_cart_summary(items)


@router.post("", response_model=CartSummaryResponse, status_code=status.HTTP_201_CREATED, summary="Add item to cart")
def add_to_cart(
    item_in: CartItemCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a product to user's cart or increase quantity if already present."""
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if product.stock < item_in.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Requested quantity exceeds available stock ({product.stock} available)"
        )

    cart_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == item_in.product_id
    ).first()

    if cart_item:
        new_quantity = cart_item.quantity + item_in.quantity
        if new_quantity > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot add more. Stock limit of {product.stock} reached."
            )
        cart_item.quantity = new_quantity
    else:
        cart_item = CartItem(
            user_id=current_user.id,
            product_id=item_in.product_id,
            quantity=item_in.quantity
        )
        db.add(cart_item)

    db.commit()

    items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.user_id == current_user.id)
        .order_by(CartItem.created_at.desc())
        .all()
    )
    return _calculate_cart_summary(items)


@router.put("/{product_id}", response_model=CartSummaryResponse, summary="Update quantity for a cart item")
def update_cart_item(
    product_id: int,
    item_in: CartItemUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Set new quantity for a product in cart, or remove if quantity is 0 or less."""
    cart_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == product_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in cart")

    if item_in.quantity <= 0:
        db.delete(cart_item)
    else:
        product = db.query(Product).filter(Product.id == product_id).first()
        if product and item_in.quantity > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot exceed available stock ({product.stock})"
            )
        cart_item.quantity = item_in.quantity

    db.commit()

    items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.user_id == current_user.id)
        .order_by(CartItem.created_at.desc())
        .all()
    )
    return _calculate_cart_summary(items)


@router.delete("/{product_id}", response_model=CartSummaryResponse, summary="Remove a single product from cart")
def remove_from_cart(
    product_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a specific product from user's shopping cart."""
    cart_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == product_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not in cart")

    db.delete(cart_item)
    db.commit()

    items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.user_id == current_user.id)
        .order_by(CartItem.created_at.desc())
        .all()
    )
    return _calculate_cart_summary(items)


@router.delete("", status_code=status.HTTP_200_OK, summary="Clear user's entire cart")
def clear_cart(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove all items from current user's cart."""
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared successfully"}

