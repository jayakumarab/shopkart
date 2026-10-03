from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    image_url = Column(String(500), nullable=True)

    # Relationships
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

