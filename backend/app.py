import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from config import init_db, mongo
from auth import auth_routes

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Set Flask configurations
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default_secret_key")
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/migration_dashboard")

jwt = JWTManager(app)

# Initialize MongoDB once
init_db(app)

# Register API routes
app.register_blueprint(auth_routes, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
