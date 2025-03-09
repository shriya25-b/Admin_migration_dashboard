import { useState } from "react";
import { Upload, Card, Alert, Typography, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const CSVUploader = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setSuccessMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage(`Successfully uploaded ${response.data.inserted_records} records!`);
      message.success(`Uploaded ${response.data.inserted_records} new records.`);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to upload CSV.");
      message.error(error.response?.data?.error || "Upload failed.");
    } finally {
      setLoading(false);
    }
    
    return false; // Prevents default upload behavior
  };

  return (
    <div>
      <Card>
        <Title level={4}>Upload Student Data</Title>
        <Text type="secondary">
          Upload a CSV file containing student migration data. The file must include the following columns:
        </Text>

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
          style={{ margin: "16px 0" }}
        />

        <Dragger
          name="file"
          accept=".csv"
          showUploadList={false}
          beforeUpload={handleUpload}
          disabled={loading}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Only CSV files are allowed.</p>
        </Dragger>

        {successMessage && (
          <Alert
            message="Success"
            description={successMessage}
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>
    </div>
  );
};

export default CSVUploader;
