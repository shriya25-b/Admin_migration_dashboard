from flask_pymongo import PyMongo

mongo = PyMongo()  # Initialize MongoDB globally

def init_db(app):
    """Initialize MongoDB with Flask app."""
    app.config["MONGO_URI"] = "mongodb://localhost:27017/migration_dashboard"  # Local MongoDB
    mongo.init_app(app)  # Properly attach MongoDB to Flask app
    return mongo  # Return MongoDB instance
