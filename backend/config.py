from flask_pymongo import PyMongo

mongo = PyMongo()  # ✅ Initialize PyMongo without app

def init_db(app):
    app.config["MONGO_URI"] = "mongodb://localhost:27017/migration_dashboard"
    mongo.init_app(app)  # ✅ Initialize with app context
    return mongo
