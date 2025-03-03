from flask_pymongo import PyMongo

def init_db(app):
    """Initialize MongoDB connection for local development."""
    app.config["MONGO_URI"] = "mongodb://localhost:27017/migration_dashboard"  # Local MongoDB
    mongo = PyMongo(app)
    return mongo  # Return MongoDB instance
