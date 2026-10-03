from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from .product import ProductResponse


class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int] = None
    quantity: int
    price: float
    product: Optional[ProductResponse] = None

    model_config = ConfigDict(from_attributes=True)


class OrderCreate(BaseModel):
    shipping_address: Optional[str] = "Demo Address, Flat 101, MG Road, Bengaluru, Karnataka, 560001"


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_address: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)

