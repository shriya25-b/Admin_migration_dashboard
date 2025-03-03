from flask_bcrypt import Bcrypt
from pymongo import MongoClient

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt()

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["migration_dashboard"]

# New admin credentials
admin_email = "admin@example.com"
admin_password = "admin123"

# Check if admin already exists
existing_admin = db.admins.find_one({"email": admin_email})

if existing_admin:
    print("⚠️ Admin already exists. Delete the old one or use a different email.")
else:
    # Hash password before storing in MongoDB
    hashed_password = bcrypt.generate_password_hash(admin_password).decode("utf-8")

    # Insert new admin user
    admin_user = {
        "email": admin_email,
        "password": hashed_password
    }

    db.admins.insert_one(admin_user)
    print("✅ New admin user created successfully!")
