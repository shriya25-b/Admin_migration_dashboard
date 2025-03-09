import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import { ConfigProvider } from "antd";
import { AuthProvider } from "./context/AuthContext";
import { StudentProvider } from "./context/StudentContext";
import AppLayout from "./components/Layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import UploadPage from "./pages/UploadPage";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Correct import

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
      <AuthProvider>
        <StudentProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="upload" element={<UploadPage />} />
              </Route>

              {/* Catch-all Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </StudentProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
