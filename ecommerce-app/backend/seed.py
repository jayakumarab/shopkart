import os
import sys

# Ensure backend root is on sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base, SessionLocal
from app.models.category import Category
from app.models.product import Product
from app.models.user import User
from app.utils.password import hash_password


CATEGORIES = [
    {
        "name": "Mobiles",
        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80"
    },
    {
        "name": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"
    },
    {
        "name": "Fashion",
        "image_url": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&auto=format&fit=crop&q=80"
    },
    {
        "name": "Home Appliances",
        "image_url": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300&auto=format&fit=crop&q=80"
    },
    {
        "name": "Beauty",
        "image_url": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80"
    },
    {
        "name": "Books",
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80"
    },
    {
        "name": "Grocery",
        "image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80"
    },
]

PRODUCTS = [
    # Mobiles
    {
        "category": "Mobiles",
        "name": "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)",
        "description": "Experience next-gen AI with Galaxy AI, 200MP camera with ultra-clear nightography, Snapdragon 8 Gen 3 processor, and built-in S-Pen.",
        "price": 129999.0,
        "original_price": 139999.0,
        "discount": 7.0,
        "rating": 4.8,
        "stock": 25,
        "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Mobiles",
        "name": "Apple iPhone 15 (Blue, 128GB)",
        "description": "Dynamic Island, 48MP main camera with 2x Telephoto, durable color-infused glass, aluminum design, and USB-C connectivity.",
        "price": 71999.0,
        "original_price": 79900.0,
        "discount": 10.0,
        "rating": 4.7,
        "stock": 40,
        "image_url": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Mobiles",
        "name": "OnePlus 12R (Cool Blue, 16GB RAM, 256GB)",
        "description": "Flagship 4th Gen LTPO 120Hz ProXDR display, Snapdragon 8 Gen 2, 5500 mAh battery with 100W SUPERVOOC charging.",
        "price": 45999.0,
        "original_price": 49999.0,
        "discount": 8.0,
        "rating": 4.6,
        "stock": 30,
        "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Mobiles",
        "name": "Redmi Note 13 Pro+ 5G (Fusion Purple, 256GB)",
        "description": "Flagship 200MP OIS camera, 3D Curved 1.5K 120Hz AMOLED display, IP68 water & dust resistance, and 120W HyperCharge.",
        "price": 27999.0,
        "original_price": 33999.0,
        "discount": 18.0,
        "rating": 4.4,
        "stock": 50,
        "image_url": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80"
    },

    # Electronics
    {
        "category": "Electronics",
        "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        "description": "Industry leading noise cancellation with two processors and 8 microphones, magnificent sound engineered to perfection, 30-hour battery life.",
        "price": 28990.0,
        "original_price": 34990.0,
        "discount": 17.0,
        "rating": 4.9,
        "stock": 20,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Electronics",
        "name": "MacBook Air M2 (13.6-inch, 8GB RAM, 256GB SSD, Midnight)",
        "description": "Strikingly thin design, up to 18 hours of battery life, gorgeous Liquid Retina display, advanced camera and audio.",
        "price": 94990.0,
        "original_price": 99900.0,
        "discount": 5.0,
        "rating": 4.8,
        "stock": 15,
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Electronics",
        "name": "Logitech MX Master 3S Wireless Performance Mouse",
        "description": "Quiet clicks, 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, ergonomic silhouette for all-day comfort.",
        "price": 8995.0,
        "original_price": 10995.0,
        "discount": 18.0,
        "rating": 4.7,
        "stock": 45,
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Electronics",
        "name": "boAt Stone 350 10W Bluetooth Speaker (Blue)",
        "description": "10W dynamic stereo sound, 12 hours playback, IPX7 water resistance, TWS feature for double punch sound.",
        "price": 1499.0,
        "original_price": 3490.0,
        "discount": 57.0,
        "rating": 4.3,
        "stock": 80,
        "image_url": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80"
    },

    # Fashion
    {
        "category": "Fashion",
        "name": "Men's Slim Fit Casual Denim Jacket",
        "description": "Classic vintage washed pure cotton denim jacket with dual chest flap pockets, durable metal buttons, and modern tapered fit.",
        "price": 1799.0,
        "original_price": 3999.0,
        "discount": 55.0,
        "rating": 4.3,
        "stock": 60,
        "image_url": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Fashion",
        "name": "Women's Pure Kanjivaram Silk Saree (Royal Maroon)",
        "description": "Traditional woven zari border and pallu with matching unstitched blouse piece. Perfect for festive ceremonies and weddings.",
        "price": 2499.0,
        "original_price": 6999.0,
        "discount": 64.0,
        "rating": 4.6,
        "stock": 35,
        "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Fashion",
        "name": "Puma Unisex White Breathable Sneakers",
        "description": "Lightweight cushioned streetwear sneakers with rubber outsole, breathable mesh upper, and softfoam+ sockliner.",
        "price": 2899.0,
        "original_price": 4999.0,
        "discount": 42.0,
        "rating": 4.4,
        "stock": 50,
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    },

    # Home Appliances
    {
        "category": "Home Appliances",
        "name": "Philips Digital Air Fryer (4.1 L, Rapid Air Tech)",
        "description": "Fry with up to 90% less fat. 7 pre-set touch profiles, keep warm function, dishwasher safe parts for quick cleanup.",
        "price": 6999.0,
        "original_price": 11995.0,
        "discount": 41.0,
        "rating": 4.5,
        "stock": 25,
        "image_url": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Home Appliances",
        "name": "LG 7.5 Kg 5 Star Smart Inverter Washing Machine",
        "description": "Fully automatic top load with Smart Motion, TurboDrum, stainless steel inner tub, and Smart Diagnosis system.",
        "price": 17490.0,
        "original_price": 22490.0,
        "discount": 22.0,
        "rating": 4.4,
        "stock": 18,
        "image_url": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Home Appliances",
        "name": "Prestige Iris 750 Watt Mixer Grinder (3 Jars)",
        "description": "Heavy duty 750W motor with overload protection, 3 stainless steel multipurpose jars, and transparent polycarbonate juicer jar.",
        "price": 3199.0,
        "original_price": 6295.0,
        "discount": 49.0,
        "rating": 4.2,
        "stock": 40,
        "image_url": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80"
    },

    # Beauty
    {
        "category": "Beauty",
        "name": "Minimalist 10% Niacinamide Face Serum (30ml)",
        "description": "Infused with Zinc PCA and EUK-134 for acne mark reduction, skin barrier repair, and sebum balance.",
        "price": 569.0,
        "original_price": 599.0,
        "discount": 5.0,
        "rating": 4.6,
        "stock": 100,
        "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Beauty",
        "name": "Forest Essentials Organic Rosewater Facial Mist (130ml)",
        "description": "Pure steam distilled water of Kannauj roses that hydrates, re-energizes, and balances the skin pH.",
        "price": 1350.0,
        "original_price": 1500.0,
        "discount": 10.0,
        "rating": 4.7,
        "stock": 60,
        "image_url": "https://images.unsplash.com/photo-1608248597359-009477016cf1?w=600&auto=format&fit=crop&q=80"
    },

    # Books
    {
        "category": "Books",
        "name": "Atomic Habits by James Clear (Hardcover Edition)",
        "description": "An easy & proven way to build good habits and break bad ones. The multi-million global bestseller.",
        "price": 549.0,
        "original_price": 799.0,
        "discount": 31.0,
        "rating": 4.9,
        "stock": 75,
        "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Books",
        "name": "The Psychology of Money by Morgan Housel",
        "description": "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know.",
        "price": 349.0,
        "original_price": 499.0,
        "discount": 30.0,
        "rating": 4.8,
        "stock": 85,
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    },

    # Grocery
    {
        "category": "Grocery",
        "name": "Tata Tea Gold Royal Blend Rich Taste (1 kg)",
        "description": "Exquisite blend of gently rolled aromatic long leaves with Assam CTC tea leaves for unforgettable taste and aroma.",
        "price": 489.0,
        "original_price": 620.0,
        "discount": 21.0,
        "rating": 4.6,
        "stock": 120,
        "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80"
    },
    {
        "category": "Grocery",
        "name": "Happilo 100% Natural California Almonds (500g)",
        "description": "Crunchy, raw, unroasted, non-GMO premium quality almonds rich in Vitamin E, magnesium, and plant protein.",
        "price": 449.0,
        "original_price": 699.0,
        "discount": 35.0,
        "rating": 4.5,
        "stock": 90,
        "image_url": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80"
    }
]


def seed_database():
    """Populate database with sample categories, products, and default test demo user."""
    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Seed Demo User
        demo_email = "demo@example.com"
        demo_user = db.query(User).filter(User.email == demo_email).first()
        if not demo_user:
            demo_user = User(
                name="Rahul Sharma",
                email=demo_email,
                password_hash=hash_password("password123"),
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            print(f"Created demo user: {demo_email} (password: password123)")
        else:
            print(f"Demo user already exists: {demo_email}")

        # Seed Categories
        cat_map = {}
        for cat_data in CATEGORIES:
            cat = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not cat:
                cat = Category(name=cat_data["name"], image_url=cat_data["image_url"])
                db.add(cat)
                db.commit()
                db.refresh(cat)
                print(f"Created category: {cat.name}")
            cat_map[cat.name] = cat.id

        # Seed Products
        for prod_data in PRODUCTS:
            existing = db.query(Product).filter(Product.name == prod_data["name"]).first()
            if not existing:
                category_id = cat_map.get(prod_data["category"])
                if category_id:
                    new_prod = Product(
                        name=prod_data["name"],
                        description=prod_data["description"],
                        price=prod_data["price"],
                        original_price=prod_data["original_price"],
                        discount=prod_data["discount"],
                        rating=prod_data["rating"],
                        stock=prod_data["stock"],
                        image_url=prod_data["image_url"],
                        category_id=category_id
                    )
                    db.add(new_prod)
                    print(f"Created product: {prod_data['name']}")

        db.commit()
        print("Database seeding completed successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

