from flask import Blueprint, request, jsonify
import pandas as pd
from config import mongo  # ✅ Use the global mongo object

upload_routes = Blueprint("upload_routes", __name__)

@upload_routes.route("/api/upload-csv", methods=["POST"])
def upload_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Invalid file format. Please upload a CSV file."}), 400

    try:
        # Read the CSV file
        df = pd.read_csv(file)

        # Check if required columns exist
        required_columns = ["Name", "Email", "Gender", "Aadhar No", "Migration From City", "State", "Education", "Duration of Living"]
        if not all(column in df.columns for column in required_columns):
            return jsonify({"error": "Invalid CSV format. Please ensure all required columns are present."}), 400

        # Convert Aadhar No to string and remove whitespace
        df["Aadhar No"] = df["Aadhar No"].astype(str).str.strip()

        # ✅ Get existing Aadhar Nos from MongoDB
        existing_aadhar_nos = set(doc["Aadhar No"] for doc in mongo.db.students.find({}, {"Aadhar No": 1}))

        # ✅ Filter out duplicate records before inserting
        new_students = df[~df["Aadhar No"].isin(existing_aadhar_nos)].to_dict(orient="records")  # ✅ Convert properly to a list of dictionaries

        if new_students:
            mongo.db.students.insert_many(new_students)
            return jsonify({"message": f"CSV uploaded successfully!", "inserted_records": len(new_students)}), 201
        else:
            return jsonify({"message": "No new students added, all entries were duplicates."}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to process CSV: {str(e)}"}), 500









#  from flask import Blueprint, request, jsonify
# import pandas as pd
# from config import mongo  # ✅ Use the global mongo object

# upload_routes = Blueprint("upload_routes", __name__)

# @upload_routes.route("/api/upload-csv", methods=["POST"])
# def upload_csv():
#     if "file" not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400

#     file = request.files["file"]

#     if not file.filename.endswith(".csv"):
#         return jsonify({"error": "Invalid file format. Please upload a CSV file."}), 400

#     try:
#         # Read the CSV file
#         df = pd.read_csv(file)

#         # Check if required columns exist
#         required_columns = ["Name", "Email", "Gender", "Aadhar No", "Migration From City", "State", "Education", "Duration of Living"]
#         if not all(column in df.columns for column in required_columns):
#             return jsonify({"error": "Invalid CSV format. Please ensure all required columns are present."}), 400

#         # Convert DataFrame to dictionary format for MongoDB
#         data = df.to_dict(orient="records")

#         # Prevent duplicate entries using Aadhar No as unique identifier
#         inserted_count = 0
#         for student in data:
#             if not mongo.db.students.find_one({"Aadhar No": student["Aadhar No"]}):  # ✅ Check if student exists
#                 mongo.db.students.insert_one(student)
#                 inserted_count += 1

#         return jsonify({"message": "CSV uploaded successfully!", "inserted_records": inserted_count}), 201

#     except Exception as e:
#         return jsonify({"error": f"Failed to process CSV: {str(e)}"}), 500
