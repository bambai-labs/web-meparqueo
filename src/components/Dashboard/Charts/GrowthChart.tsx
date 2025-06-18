import { Card, Title } from '@mantine/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthlyGrowth } from '../../../store/dashboard/types';

interface GrowthChartProps {
  data: MonthlyGrowth[];
  title: string;
}

export function GrowthChart({ data, title }: GrowthChartProps) {
  const chartData = data.map((item) => ({
    month: new Date(item.month).toLocaleDateString('es-ES', {
      month: 'short',
      year: 'numeric',
    }),
    users: item.users,
    parkingLots: item.parkingLots,
  }));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">
        {title}
      </Title>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#8884d8"
            strokeWidth={2}
            name="Usuarios"
          />
          <Line
            type="monotone"
            dataKey="parkingLots"
            stroke="#82ca9d"
            strokeWidth={2}
            name="Parqueaderos"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
