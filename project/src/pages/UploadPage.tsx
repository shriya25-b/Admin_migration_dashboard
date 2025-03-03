import { Typography } from 'antd';
import CSVUploader from '../components/Upload/CSVUploader';

const { Title, Paragraph } = Typography;

const UploadPage = () => {
  return (
    <div>
      <Title level={2}>Upload Student Data</Title>
      <Paragraph>
        Upload a CSV file containing student migration data. The system will process the file and add the records to the database.
      </Paragraph>
      <CSVUploader />
    </div>
  );
};

export default UploadPage;