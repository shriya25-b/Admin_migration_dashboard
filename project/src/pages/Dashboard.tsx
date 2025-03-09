import { useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Alert, Tabs } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import { useStudents } from '../context/StudentContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const studentContext = useStudents();
  const { stats, loading, fetchAllStudents } = studentContext || { stats: null, loading: true, fetchAllStudents: () => {} };

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!stats) {
    return <Alert message="No data available" type="info" showIcon />;
  }

  // Prepare data for charts
  const stateChartData = {
    labels: Object.keys(stats.stateDistribution),
    datasets: [{
      label: 'Students per State',
      data: Object.values(stats.stateDistribution),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const yearChartData = {
    labels: Object.keys(stats.yearlyApplications),
    datasets: [{
      label: 'Yearly Applications',
      data: Object.values(stats.yearlyApplications),
      borderColor: '#ff7300',
      backgroundColor: 'rgba(255, 115, 0, 0.5)',
      fill: true,
    }],
  };

  const educationChartData = {
    labels: Object.keys(stats.educationDistribution),
    datasets: [{
      data: Object.values(stats.educationDistribution),
      backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
    }],
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="Total Students" value={stats.totalStudents} prefix={<UserOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Pending Applications" value={stats.pendingApplications} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="Approved Applications" value={stats.approvedApplications} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="Rejected Applications" value={stats.rejectedApplications} prefix={<CloseCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Student Distribution" key="1">
          <Bar data={stateChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Yearly Trends" key="2">
          <Line data={yearChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Education Level" key="3">
          <Pie data={educationChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;
