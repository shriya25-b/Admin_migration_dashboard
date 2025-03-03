import { useState } from 'react';
import { Upload, Button, Card, Alert, Table, Typography, message } from 'antd';
import { UploadOutlined, FileExcelOutlined, InboxOutlined } from '@ant-design/icons';
import { useStudents } from '../../context/StudentContext';
import Papa from 'papaparse';
import type { UploadProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const CSVUploader = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { uploadCSV, loading } = useStudents();

  const handleCSVParse = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            // Validate required headers
            const requiredHeaders = ['name', 'email', 'currentSchool', 'targetSchool'];
            const fileHeaders = Object.keys(results.data[0]).map(header => header.toLowerCase());
            
            const missingHeaders = requiredHeaders.filter(
              header => !fileHeaders.includes(header.toLowerCase())
            );

            if (missingHeaders.length > 0) {
              setError(`Missing required columns: ${missingHeaders.join(', ')}`);
              reject(new Error(`Missing required columns: ${missingHeaders.join(', ')}`));
              return;
            }

            setHeaders(Object.keys(results.data[0]));
            setCsvData(results.data);
            setError(null);
            resolve();
          } else {
            setError('The CSV file is empty');
            reject(new Error('The CSV file is empty'));
          }
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          reject(error);
        }
      });
    });
  };

  const handleUpload = async () => {
    if (csvData.length === 0) {
      setError('Please load a CSV file first');
      return;
    }

    try {
      // Format data to match API expectations
      const formattedData = csvData.map(row => ({
        name: row.name,
        email: row.email,
        currentSchool: row.currentSchool,
        targetSchool: row.targetSchool,
        status: row.status || 'pending',
        applicationDate: row.applicationDate || new Date().toISOString(),
        notes: row.notes || '',
      }));

      await uploadCSV(formattedData);
      message.success(`Successfully uploaded ${csvData.length} student records`);
      setCsvData([]);
      setHeaders([]);
    } catch (err) {
      message.error('Failed to upload CSV data');
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.csv',
    showUploadList: false,
    beforeUpload: async (file) => {
      try {
        await handleCSVParse(file);
        message.success(`${file.name} parsed successfully`);
      } catch (err) {
        message.error((err as Error).message || 'Failed to parse CSV file');
      }
      return false; // Prevent default upload behavior
    },
    disabled: loading,
  };

  const columns = headers.map(header => ({
    title: header,
    dataIndex: header,
    key: header,
    ellipsis: true,
  }));

  return (
    <div>
      <Card>
        <Title level={4}>Upload Student Data</Title>
        <Text type="secondary">
          Upload a CSV file containing student migration data. The file must include the following columns: name, email, currentSchool, targetSchool.
        </Text>

        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single CSV file upload. Make sure your CSV has the required columns.
            </p>
          </Dragger>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {csvData.length > 0 && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                <FileExcelOutlined /> Preview: {csvData.length} records found
              </Text>
            </div>
            <Table
              dataSource={csvData.slice(0, 5)}
              columns={columns}
              size="small"
              pagination={false}
              scroll={{ x: 'max-content' }}
              footer={() => csvData.length > 5 ? `Showing 5 of ${csvData.length} records` : ''}
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button
                type="primary"
                onClick={handleUpload}
                loading={loading}
                disabled={csvData.length === 0}
              >
                Upload Data
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CSVUploader;