import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from config import init_db, mongo
from auth import auth_routes
from upload_routes import upload_routes 
from student_routes import student_routes
from flask import Flask, jsonify


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
app.register_blueprint(upload_routes)
app.register_blueprint(student_routes)



# @app.route("/api/stats", methods=["GET"])
# def get_stats():
#     try:
#         total_students = mongo.db.students.count_documents({})
#         total_migrations = mongo.db.students.count_documents({"Migration From City": {"$exists": True}})

#         stats = {
#             "total_students": total_students,
#             "total_migrations": total_migrations
#         }

#         return jsonify(stats), 200

#     except Exception as e:
#         return jsonify({"error": f"Failed to fetch stats: {str(e)}"}), 500
if __name__ == "__main__":
    app.run(debug=True)
