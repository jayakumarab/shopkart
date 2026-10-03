# Flipkart-Style E-Commerce Full-Stack Application

A modern, responsive, and beginner-friendly full-stack e-commerce web application inspired by Flipkart-style Indian e-commerce design. Built for college projects, viva presentations, and portfolio demos.

---

## 🌟 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios (with auto Bearer JWT interceptors)
- **State Management**: React Context API (`AuthContext`, `CartContext`, `ToastContext`)
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Validation & Serialization**: Pydantic v2
- **Authentication**: JWT (JSON Web Tokens) with `python-jose`
- **Password Hashing**: `bcrypt` (secure salted hashes)
- **Database Migrations**: Alembic
- **API Documentation**: Interactive Swagger UI (`/docs`) & ReDoc (`/redoc`)

---

## 📁 Project Structure

```text
ecommerce-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI (Header, CategoryBar, ProductCard, SkeletonLoader, EmptyState, ProtectedRoute)
│   │   ├── pages/               # Views (HomePage, ProductsPage, ProductDetailsPage, LoginPage, RegisterPage, CartPage, CheckoutPage, OrdersPage, ProfilePage, NotFoundPage)
│   │   ├── layouts/             # MainLayout with sticky header & footer
│   │   ├── context/             # AuthContext, CartContext, ToastContext
│   │   ├── services/            # Axios API service (auth, products, categories, cart, orders)
│   │   ├── hooks/               # Custom hooks (useDebounce)
│   │   ├── utils/               # Formatters (Indian Rupee format, date formatting)
│   │   ├── App.jsx              # Main router & provider wrapper
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind CSS base styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── backend/
    ├── app/
    │   ├── main.py              # FastAPI app & CORS configuration
    │   ├── database.py          # SQLAlchemy engine, session maker & get_db dependency
    │   ├── models/              # SQLAlchemy DB models (User, Category, Product, CartItem, Order, OrderItem)
    │   ├── schemas/             # Pydantic validation schemas
    │   ├── routes/              # Modular API endpoints (auth, products, categories, cart, orders)
    │   ├── auth/                # JWT token helpers & security dependencies
    │   └── utils/               # Bcrypt password hashing utilities
    ├── alembic/                 # Alembic migration scripts
    ├── alembic.ini              # Alembic configuration
    ├── seed.py                  # Seed script with 20+ realistic products & demo user
    ├── requirements.txt         # Python dependencies
    ├── .env                     # Local environment settings
    └── .env.example             # Example environment template
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (PostgreSQL)

Ensure PostgreSQL is installed and running on your system:
```sql
CREATE DATABASE flipkart_clone;
```

### 2. Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd ecommerce-app/backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:root@localhost:5432/flipkart_clone
   SECRET_KEY=change-this-secret-key-super-secret-flipkart-2026
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```
   *(Update username `postgres` and password `root` to match your local PostgreSQL configuration)*

5. Run database migrations and seed realistic sample products:
   ```bash
   python seed.py
   ```

6. Start the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   Backend will be available at `http://localhost:8000`  
   Swagger UI API documentation at `http://localhost:8000/docs`

---

### 3. Frontend Setup

1. Open another terminal and navigate to `frontend/`:
   ```bash
   cd ecommerce-app/frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Verify `.env` file has:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will run at `http://localhost:5173`

---

## 🔑 Demo Credentials

A test demo account is already seeded into the database:
- **Email**: `demo@example.com`
- **Password**: `password123`

You can also create a new account anytime on the `/register` page.

---

## 🎯 College / Demo Presentation Walkthrough

Follow this step-by-step flow to impress your examiner or audience:

1. **Homepage (`/`)**:
   - Show the header with original "ShopKart" logo, search bar, and cart badge.
   - Show the category icons navigation bar (Mobiles, Electronics, Fashion, Home Appliances, Beauty, Books, Grocery).
   - Point out the promotional hero banner with responsive layout.
   - Walk through the 4 deal sections: **Top Deals**, **Best Sellers**, **Trending Products**, and **Recommended Products**.

2. **Product Catalog & Filters (`/products`)**:
   - Filter by category (e.g. check "Mobiles").
   - Filter by price slider (adjust to max ₹50,000).
   - Filter by customer rating (e.g. 4★ & above).
   - Sort by "Price: Low to High" or "Customer Rating".
   - Use the live search bar at the top (e.g. type `Samsung` or `Headphones`).
   - Highlight pagination controls.

3. **Product Details Page (`/products/:id`)**:
   - Click any product to view its high-res image, stock count, formatted Indian Rupee price with strike-through and discount percentage.
   - Adjust the quantity with `[-]` and `[+]`.
   - Test the PIN code delivery estimator simulator.
   - Click **Add to Cart**.

4. **Cart Synchronization (`/cart`)**:
   - Show the cart displaying items saved to the PostgreSQL database.
   - Modify quantities or remove an item.
   - Point out the real-time sticky **Price Details** card (Subtotal, Discount, Delivery Charges, Total Payable).
   - Click **Proceed to Checkout**.

5. **Checkout & Order Placement (`/checkout`)**:
   - Show the prefilled or custom delivery address form.
   - Review the order summary items and select payment method (Cash on Delivery demo mode).
   - Click **Place Order**.

6. **Order History (`/orders`)**:
   - Verify the newly created order appears with an assigned Order ID, order date, delivery address, and "Processing" status badge.
   - Show that the cart was automatically cleared upon order placement.

7. **User Profile (`/profile`)**:
   - View customer information, member badge, order counter, and logout option.

8. **Swagger API Docs (`http://localhost:8000/docs`)**:
   - Open `/docs` in the browser to showcase FastAPI's interactive OpenAPI documentation.
   - Test `GET /products`, `POST /auth/login`, and `GET /cart` directly from Swagger.

---

## 🛡️ Security Features
- Passwords hashed using industry-standard **bcrypt** salts. Plain text passwords are never stored.
- JWT tokens signed using **HMAC-SHA256 (HS256)** with expiration timestamps.
- Route protection both on frontend (via React Route Guards) and backend (via FastAPI `Depends(get_current_active_user)`).
- SQL injection prevention through SQLAlchemy parameter binding.
- Input validation through Pydantic schemas.

