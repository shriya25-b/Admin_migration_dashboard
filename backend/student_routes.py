from flask import Blueprint, request, jsonify, send_file
import pandas as pd
from config import mongo
from io import BytesIO
from fpdf import FPDF
from pymongo.errors import DuplicateKeyError

student_routes = Blueprint("student_routes", __name__)

# ✅ 🚀 Get All Students
@student_routes.route("/api/students", methods=["GET"])
def get_students():
    try:
        students = list(mongo.db.students.find({}, {"_id": 0}))
        return jsonify(students), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ 🚀 Add a Student (Prevent Duplicates)
@student_routes.route("/api/students", methods=["POST"])
def add_student():
    data = request.json
    if not data.get("Aadhar No"):
        return jsonify({"error": "Aadhar No is required"}), 400

    # ✅ Ensure Aadhar No is always stored as a string
    data["Aadhar No"] = str(data["Aadhar No"]).strip()

    try:
        mongo.db.students.insert_one(data)
        return jsonify({"message": "Student added successfully!"}), 201
    except DuplicateKeyError:
        return jsonify({"error": "Student with this Aadhar No already exists"}), 400

# ✅ Update Student API
@student_routes.route("/api/students/<aadhar_no>", methods=["PUT"])
def update_student(aadhar_no):
    aadhar_no = str(aadhar_no).strip()
    data = request.json

    if not data:
        return jsonify({"error": "No update data provided"}), 400

    student = mongo.db.students.find_one({"Aadhar No": aadhar_no})

    if not student:
        return jsonify({"error": "Student not found"}), 404

    # ✅ Ensure only valid fields are updated
    allowed_fields = ["Name", "Email", "Migration From City", "State", "Education", "Duration of Living"]
    update_data = {key: data[key] for key in data if key in allowed_fields}

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    mongo.db.students.update_one(
        {"Aadhar No": aadhar_no},
        {"$set": update_data}
    )

    return jsonify({"message": "Student updated successfully!"}), 200

# ✅ Delete Student API
@student_routes.route("/api/students/<aadhar_no>", methods=["DELETE"])
def delete_student(aadhar_no):
    aadhar_no = str(aadhar_no).strip()
    student = mongo.db.students.find_one({"Aadhar No": aadhar_no})

    if not student:
        return jsonify({"error": "Student not found"}), 404

    mongo.db.students.delete_one({"Aadhar No": aadhar_no})
    return jsonify({"message": "Student deleted successfully!"}), 200

# ✅ 🚀 Export Students (CSV or PDF)
@student_routes.route("/api/export", methods=["GET"])
def export_students():
    format_type = request.args.get("format", "csv")

    students = list(mongo.db.students.find({}, {"_id": 0}))
    previous_students = list(mongo.db.previous_students.find({}, {"_id": 0}))

    df_students = pd.DataFrame(students)
    df_previous = pd.DataFrame(previous_students)

    df_combined = pd.concat([df_students, df_previous], ignore_index=True)

    if format_type == "csv":
        csv_buffer = BytesIO()
        df_combined.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)
        return send_file(csv_buffer, mimetype="text/csv", as_attachment=True, download_name="students_data.csv")

    elif format_type == "pdf":
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=10)
        pdf.add_page()
        pdf.set_font("Arial", size=10)

        for _, row in df_combined.iterrows():
            row_text = f'{row.to_dict()}'
            pdf.multi_cell(190, 10, row_text, border=0)

        pdf_output = pdf.output(dest='S').encode('latin1')
        pdf_buffer = BytesIO(pdf_output)
        pdf_buffer.seek(0)
        return send_file(pdf_buffer, mimetype="application/pdf", as_attachment=True, download_name="students_data.pdf")

    return jsonify({"error": "Invalid format"}), 400










# from flask import Blueprint, request, jsonify, send_file
# import pandas as pd
# from config import mongo
# from io import BytesIO
# from fpdf import FPDF

# student_routes = Blueprint("student_routes", __name__)

# # ✅ 🚀 **Get All Students**
# @student_routes.route("/api/students", methods=["GET"])
# def get_students():
#     try:
#         students = list(mongo.db.students.find({}, {"_id": 0}))
#         return jsonify(students), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # ✅ 🚀 **Add a Student**
# # @student_routes.route("/api/students", methods=["POST"])
# # def add_student():
# #     try:
# #         data = request.json
# #         if not data:
# #             return jsonify({"error": "No data provided"}), 400

# #         required_fields = ["Name", "Email", "Aadhar No", "Migration From City", "State", "Education", "Duration of Living"]
# #         if not all(field in data for field in required_fields):
# #             return jsonify({"error": "Missing required fields"}), 400

# #         # Check for duplicates
# #         if mongo.db.students.find_one({"Aadhar No": data["Aadhar No"]}):
# #             return jsonify({"error": "Student with this Aadhar No already exists"}), 400

# #         mongo.db.students.insert_one(data)
# #         return jsonify({"message": "Student added successfully!"}), 201
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500
# @student_routes.route("/api/students", methods=["POST"])
# def add_student():
#     data = request.json
#     if not data.get("Aadhar No"):
#         return jsonify({"error": "Aadhar No is required"}), 400

#     # ✅ Ensure Aadhar No is always stored as a string
#     data["Aadhar No"] = str(data["Aadhar No"]).strip()

#     if mongo.db.students.find_one({"Aadhar No": data["Aadhar No"]}):
#         return jsonify({"error": "Student already exists"}), 400

#     mongo.db.students.insert_one(data)
#     return jsonify({"message": "Student added successfully!"}), 201


# # ✅ Update Student API
# @student_routes.route("/api/students/<aadhar_no>", methods=["PUT"])
# def update_student(aadhar_no):
#     aadhar_no = str(aadhar_no).strip()  # Ensure it's a string
#     data = request.json

#     if not data:
#         return jsonify({"error": "No update data provided"}), 400

#     student = mongo.db.students.find_one({"Aadhar No": aadhar_no})

#     if not student:
#         return jsonify({"error": "Student not found"}), 404

#     # ✅ Ensure only valid fields are updated
#     allowed_fields = ["Name", "Email", "Migration From City", "State", "Education", "Duration of Living"]
#     update_data = {key: data[key] for key in data if key in allowed_fields}

#     if not update_data:
#         return jsonify({"error": "No valid fields to update"}), 400

#     mongo.db.students.update_one(
#         {"Aadhar No": aadhar_no},
#         {"$set": update_data}
#     )

#     return jsonify({"message": "Student updated successfully!"}), 200




# @student_routes.route("/api/students/<aadhar_no>", methods=["DELETE"])
# def delete_student(aadhar_no):
#     aadhar_no = str(aadhar_no).strip()  # Ensure it's a string

#     student = mongo.db.students.find_one({"Aadhar No": aadhar_no})

#     if not student:
#         return jsonify({"error": "Student not found"}), 404

#     mongo.db.students.delete_one({"Aadhar No": aadhar_no})

#     return jsonify({"message": "Student deleted successfully!"}), 200






# # ✅ 🚀 **Export Students (CSV or PDF)**
# @student_routes.route("/api/export", methods=["GET"])
# def export_students():
#     format_type = request.args.get("format", "csv")

#     students = list(mongo.db.students.find({}, {"_id": 0}))
#     previous_students = list(mongo.db.previous_students.find({}, {"_id": 0}))

#     df_students = pd.DataFrame(students)
#     df_previous = pd.DataFrame(previous_students)

#     df_combined = pd.concat([df_students, df_previous], ignore_index=True)  # Merge previous and updated records

#     if format_type == "csv":
#         csv_buffer = BytesIO()
#         df_combined.to_csv(csv_buffer, index=False)
#         csv_buffer.seek(0)
#         return send_file(csv_buffer, mimetype="text/csv", as_attachment=True, download_name="students_data.csv")

#     elif format_type == "pdf":
#         pdf = FPDF()
#         pdf.set_auto_page_break(auto=True, margin=10)
#         pdf.add_page()
#         pdf.set_font("Arial", size=10)

#         for index, row in df_combined.iterrows():
#             row_text = f'{row.to_dict()}'
#             pdf.multi_cell(190, 10, row_text, border=0)

#         pdf_output = pdf.output(dest='S').encode('latin1')  # Convert to binary

#         pdf_buffer = BytesIO(pdf_output)
#         pdf_buffer.seek(0)
#         return send_file(pdf_buffer, mimetype="application/pdf", as_attachment=True, download_name="students_data.pdf")

#     return jsonify({"error": "Invalid format"}), 400
