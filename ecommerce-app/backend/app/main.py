from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import user, category, product, cart, order  # ensure all models are imported
from .routes import (
    auth_router,
    categories_router,
    products_router,
    cart_router,
    orders_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables automatically if they don't exist
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Flipkart-Style E-Commerce API",
    description="Full-stack E-Commerce REST API built with FastAPI, PostgreSQL, SQLAlchemy, and JWT Authentication.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"  # Allows flexible demo testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(products_router)
app.include_router(cart_router)
app.include_router(orders_router)


@app.get("/", tags=["General"])
def root():
    return {
        "status": "online",
        "message": "Welcome to the Flipkart-Style E-Commerce API",
        "documentation": "/docs",
        "health": "/health"
    }


@app.get("/health", tags=["General"])
def health_check():
    return {"status": "healthy"}

