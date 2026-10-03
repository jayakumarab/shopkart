from typing import Optional
from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    image_url: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    image_url: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

