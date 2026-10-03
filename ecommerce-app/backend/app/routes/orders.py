from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models.user import User
from ..models.cart import CartItem
from ..models.product import Product
from ..models.order import Order, OrderItem
from ..schemas.order import OrderCreate, OrderResponse
from ..auth.dependencies import get_current_active_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED, summary="Create order from cart")
def place_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Place a new order converting items currently in the user's cart."""
    cart_items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.user_id == current_user.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot place order. Your shopping cart is empty."
        )

    # Calculate total and verify stock
    total_amount = 0.0
    for item in cart_items:
        if not item.product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product in cart (ID: {item.product_id}) no longer exists"
            )
        if item.product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough stock for '{item.product.name}'. Available: {item.product.stock}"
            )
        total_amount += item.product.price * item.quantity

    # Free delivery on orders ₹500 and above, ₹40 otherwise
    delivery_charge = 0.0 if total_amount >= 500 else 40.0
    final_order_total = round(total_amount + delivery_charge, 2)

    # Create Order
    new_order = Order(
        user_id=current_user.id,
        total_amount=final_order_total,
        status="Processing",
        shipping_address=order_in.shipping_address or "Standard Delivery Address"
    )
    db.add(new_order)
    db.flush()  # To populate new_order.id

    # Create OrderItems and decrement stock
    for item in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price  # Locked price at purchase time
        )
        db.add(order_item)

        # Decrement stock
        item.product.stock = max(0, item.product.stock - item.quantity)

    # Empty user's cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()

    db.commit()

    # Re-fetch order with items and products
    order_result = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product).joinedload(Product.category)
        )
        .filter(Order.id == new_order.id)
        .first()
    )
    return order_result


@router.get("", response_model=List[OrderResponse], summary="List all orders for logged-in user")
def get_user_orders(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve purchase history for the authenticated user only."""
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product).joinedload(Product.category)
        )
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.get("/{order_id}", response_model=OrderResponse, summary="Get order details by ID")
def get_order_details(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve single order details, ensuring it belongs to current user."""
    order = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product).joinedload(Product.category)
        )
        .filter(Order.id == order_id, Order.user_id == current_user.id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found or unauthorized access"
        )

    return order

