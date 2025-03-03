import { Card } from 'antd';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DashboardStats } from '../../types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface SchoolDistributionChartProps {
  stats: DashboardStats;
}

const SchoolDistributionChart = ({ stats }: SchoolDistributionChartProps) => {
  const schools = Object.keys(stats.schoolDistribution);
  const counts = Object.values(stats.schoolDistribution);

  // Generate random colors for each school
  const backgroundColors = schools.map(() => 
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
  );

  const data = {
    labels: schools,
    datasets: [
      {
        label: 'Students',
        data: counts,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Target School Distribution',
      },
    },
  };

  return (
    <Card title="School Distribution" style={{ marginTop: 16 }}>
      <Pie data={data} options={options} />
    </Card>
  );
};

export default SchoolDistributionChart;