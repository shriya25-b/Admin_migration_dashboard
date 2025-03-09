# import os
# from dotenv import load_dotenv

# load_dotenv()  # Load .env file

# print(os.getenv("JWT_SECRET_KEY"))  # Print the secret key

from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["migration_dashboard"]
students_collection = db["students"]

# ✅ Convert all Aadhar No fields to strings
students_collection.update_many(
    {},
    [{"$set": {"Aadhar No": {"$toString": "$Aadhar No"}}}]
)

print("Aadhar No fields updated to string format.")
