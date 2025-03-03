import { Card } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DashboardStats } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ApplicationChartProps {
  stats: DashboardStats;
}

const ApplicationChart = ({ stats }: ApplicationChartProps) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Applications',
      },
    },
  };

  const data = {
    labels: stats.monthlyApplications.map(item => item.month),
    datasets: [
      {
        label: 'Applications',
        data: stats.monthlyApplications.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <Card title="Application Trends" style={{ marginTop: 16 }}>
      <Bar options={options} data={data} height={300} />
    </Card>
  );
};

export default ApplicationChart;