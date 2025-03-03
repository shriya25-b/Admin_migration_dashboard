import { useEffect } from 'react';
import { Typography, Spin, Alert, Row, Col } from 'antd';
import { useStudents } from '../context/StudentContext';
import StatCards from '../components/Dashboard/StatCards';
import ApplicationChart from '../components/Dashboard/ApplicationChart';
import SchoolDistributionChart from '../components/Dashboard/SchoolDistributionChart';

const { Title } = Typography;

const DashboardPage = () => {
  const { stats, loading, error, fetchStats } = useStudents();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (!stats) {
    return <Alert message="No data available" type="info" />;
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <StatCards stats={stats} />
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <ApplicationChart stats={stats} />
        </Col>
        <Col xs={24} lg={12}>
          <SchoolDistributionChart stats={stats} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;