import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

// ✅ Get JWT token from local storage
export const getToken = () => localStorage.getItem("token");

// ✅ Check if user is authenticated
export const isAuthenticated = () => !!getToken();

// ✅ Make authenticated API requests
export const apiRequest = async (endpoint: string, method: string = "GET", data: any = null) => {
  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios({ url: `${API_URL}${endpoint}`, method, headers, data });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "API request failed" };
  }
};

// ✅ Login API (Stores JWT token)
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Login failed" };
  }
};

// ✅ Upload CSV file
export const uploadCSV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.post(`${API_URL}/upload-csv`, formData, {
      headers: { ...headers, "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "CSV upload failed" };
  }
};



// ✅ Fetch all students
export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Failed to fetch students" };
  }
};

// ✅ Add a new student (Prevents duplicates)
export const addStudent = async (student: any) => {
  try {
    const response = await axios.post(`${API_URL}/students`, student);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error === "Student already exists") {
      throw { error: "Student with this Aadhar No already exists" };
    }
    throw error.response?.data || { error: "Failed to add student" };
  }
};

// ✅ Edit an existing student
// ✅ Edit an existing student (Fixing CSV update issue)
export const updateStudent = async (aadharNo: string, updatedData: any) => {
  try {
    // Ensure Aadhar No is always a string
    const formattedAadharNo = String(aadharNo);

    const response = await axios.put(`${API_URL}/students/${formattedAadharNo}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Update Student Error:", error.response?.data || error);
    throw error.response?.data || { error: "Failed to update student" };
  }
};


// 🚀 Delete a student (Fix for Aadhar No)
export const deleteStudent = async (aadharNo: string) => {
  try {
    const formattedAadharNo = String(aadharNo).trim(); // Convert to string & remove spaces
    const response = await axios.delete(`${API_URL}/students/${formattedAadharNo}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete Student Error:", error.response?.data || error);
    throw error.response?.data || { error: "Failed to delete student" };
  }
};


// ✅ Export Students (CSV or PDF)
export const exportStudents = async (format: "csv" | "pdf") => {
  try {
    const response = await axios.get(`${API_URL}/export?format=${format}`, {
      responseType: "blob",
    });

    // Download file
    const blob = new Blob([response.data], { type: response.headers["content-type"] });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `students_data.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    throw error.response?.data || { error: "Failed to export students" };
  }
};
