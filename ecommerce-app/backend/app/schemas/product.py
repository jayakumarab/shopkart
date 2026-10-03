from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from .category import CategoryResponse


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount: Optional[float] = None
    rating: Optional[float] = 4.0
    stock: Optional[int] = 10
    image_url: Optional[str] = None
    category_id: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    discount: Optional[float] = None
    rating: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    category: Optional[CategoryResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    pages: int

