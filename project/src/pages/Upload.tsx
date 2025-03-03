import { useState } from 'react';
import { Upload, Button, message, Card, Table, Alert, Spin } from 'antd';
import { UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useStudents } from '../context/StudentContext';
import Papa from 'papaparse';

const UploadCSV = () => {
  const { uploadCSV, loading } = useStudents();
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setCsvData(results.data);
          setCsvHeaders(results.meta.fields || []);
          setPreviewVisible(true);
          message.success(`${file.name} parsed successfully`);
        } else {
          message.error('The CSV file is empty or invalid');
        }
      },
      error: (error) => {
        message.error(`Error parsing CSV: ${error.message}`);
      }
    });
    
    // Prevent default upload behavior
    return false;
  };

  const handleUpload = async () => {
    if (csvData.length === 0) {
      message.error('No data to upload');
      return;
    }

    try {
      await uploadCSV(csvData);
      message.success('CSV data uploaded successfully');
      setCsvData([]);
      setCsvHeaders([]);
      setPreviewVisible(false);
    } catch (error) {
      message.error('Failed to upload CSV data');
    }
  };

  const columns = csvHeaders.map(header => ({
    title: header,
    dataIndex: header,
    key: header,
    ellipsis: true,
  }));

  return (
    <div>
      <h1>Upload Student Data</h1>
      
      <Card style={{ marginBottom: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <FileExcelOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
          <h2>Upload CSV File</h2>
          <p>Upload a CSV file containing student migration data</p>
        </div>
        
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
          <p className="ant-upload-hint">
            Support for a single CSV file upload. Make sure your CSV has the required columns.
          </p>
        </Upload.Dragger>
        
        <div style={{ marginTop: 16 }}>
          <Alert
            message="Required CSV Format"
            description={
              <ul>
                <li>name - Student's full name</li>
                <li>email - Student's email address</li>
                <li>currentSchool - Current school name</li>
                <li>targetSchool - Target school name</li>
                <li>status - Application status (pending, approved, rejected)</li>
                <li>applicationDate - Date of application (YYYY-MM-DD)</li>
                <li>notes - Additional notes (optional)</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </div>
      </Card>
      
      {previewVisible && (
        <Card title="CSV Preview" style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading}
              disabled={csvData.length === 0}
            >
              Upload Data
            </Button>
          </div>
          
          {loading ? (
            <Spin tip="Uploading..." />
          ) : (
            <Table
              dataSource={csvData}
              columns={columns}
              rowKey={(record, index) => index.toString()}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'max-content' }}
              size="small"
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default UploadCSV;