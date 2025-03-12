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
| **Database** | MongoDB|
| **Deployment** | GitHub, Heroku (or your choice) |

---

## 🏗 **Project Setup**
### 🔹 **1. Clone the Repository**
```sh
git clone https://github.com/Yaduuuu/Admin_migration_dashboard.git
cd Admin_migration_dashboard
