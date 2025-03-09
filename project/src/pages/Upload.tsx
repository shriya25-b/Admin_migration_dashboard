import { useState } from "react";
import { Upload, message, Card, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UploadCSV = () => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success(response.data.message);
    } catch (error: any) {
      message.error(error.response?.data?.error || "Failed to upload CSV.");
    } finally {
      setLoading(false);
    }
    
    return false; // Prevents default upload behavior
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f2f5" }}>
      <Card style={{ width: 500, textAlign: "center", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <h2>Upload Student CSV</h2>

        <Upload.Dragger
          name="file"
          accept=".csv"
          beforeUpload={handleFileUpload}
          showUploadList={false}
          disabled={loading}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Only CSV files are allowed.</p>
        </Upload.Dragger>

        <Alert
          message="Required CSV Format"
          description={
            <ul style={{ textAlign: "left" }}>
              <li>Name - Student's full name</li>
              <li>Email - Student's email address</li>
              <li>Gender - Male/Female/Other</li>
              <li>Aadhar No - 12-digit unique ID</li>
              <li>Migration From City - City they migrated from</li>
              <li>State - State they migrated from</li>
              <li>Education - UG/PG/PhD/Diploma</li>
              <li>Duration of Living - How long they have lived in Pune</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>
    </div>
  );
};

export default UploadCSV;
