# 🏫 MIT Pune Migration Dashboard

## 📌 Overview
The **Migration Dashboard** is a **full-stack web application** designed to manage student migration data for MIT Pune. It provides features for **student record management, CSV uploads, data visualization, and export functionality**.

---

## 🚀 Features
### ✅ **Student Management (CRUD)**
- Add, Edit, and Delete student records.
- Prevents duplicate entries using **Aadhar No** as a unique identifier.

### ✅ **CSV Upload & Export**
- Upload CSV files to bulk import student data.
- Prevents duplicate student records.
- Export student data in **CSV** and **PDF** formats.

### ✅ **Data Visualizations (Charts)**
- 📊 **Bar Chart**: Student distribution by **State**.
- 📈 **Line Chart**: Yearly application trends.
- 🥧 **Pie Chart**: Student education levels.

### ✅ **Authentication & Role Management**
- **JWT-based authentication** (Login, Logout).
- Secure **admin-only** dashboard access.

### ✅ **Performance Optimizations**
- **Pagination & Filtering** for student records.
- **Indexing on MongoDB** to speed up lookups.
  
---

## 🛠️ **Tech Stack**
| Technology | Description |
|------------|------------|
| **Frontend** | React (TypeScript), Ant Design, Chart.js |
| **Backend**  | Flask (Python), Flask-JWT, MongoDB |
| **Database** | MongoDB |
| **Deployment** | GitHub, Heroku (or your choice) |

---

## 🏗 **Project Setup**
### 🔹 **1. Clone the Repository**
```sh
git clone https://github.com/your-username/Admin_migration_dashboard.git
cd Admin_migration_dashboard
```

### 🔹 **2. Backend Setup**
```sh
cd backend
pip install -r requirements.txt
python app.py  # Start the backend server
```

### 🔹 **3. Frontend Setup**
```sh
cd project
npm install
npm start  # Start React app
```

---

## 🔗 **API Endpoints**
### 📌 **Student APIs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/students` | Get all students |
| `POST` | `/api/students` | Add a new student |
| `PUT` | `/api/students/<aadhar_no>` | Update student details |
| `DELETE` | `/api/students/<aadhar_no>` | Delete a student |

### 📌 **CSV & Export APIs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload-csv` | Upload a CSV file |
| `GET` | `/api/export?format=csv` | Export students as CSV |
| `GET` | `/api/export?format=pdf` | Export students as PDF |


---

## 📢 **Future Enhancements**
- 🔍 **Advanced Filters & Search** (State, Education, etc.)
- 🔒 **Role-Based Access Control (RBAC)**
- 📱 **Mobile-Friendly UI Improvements**
- 📊 **More Data Insights & Reports**

---

## 👨‍💻 **Contributing**
Want to contribute? Follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit your changes: `git commit -m "Added a new feature"`
4. Push to GitHub: `git push origin feature-branch`
5. Open a **Pull Request**!

---

## 📜 **License**
This project is licensed under the **MIT License**.




