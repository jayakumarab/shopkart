from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from .product import ProductResponse


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    created_at: datetime
    product: ProductResponse
    subtotal: float

    model_config = ConfigDict(from_attributes=True)


class CartSummaryResponse(BaseModel):
    items: List[CartItemResponse]
    total_items: int
    total_original_price: float
    total_discount: float
    total_amount: float
    delivery_charge: float
    final_total: float

