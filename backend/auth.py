from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from config import mongo  # Use the globally initialized MongoDB instance

auth_routes = Blueprint("auth_routes", __name__)
bcrypt = Bcrypt()

# 🚀 Route: Admin Login
@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Check if admin exists
    admin = mongo.db.admins.find_one({"email": email})

    if not admin or not bcrypt.check_password_hash(admin["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate JWT token
    access_token = create_access_token(identity=email)
    return jsonify({"token": access_token}), 200
