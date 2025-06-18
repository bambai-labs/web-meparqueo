import { Card, Title } from '@mantine/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { LocationFrequency } from '../../../store/dashboard/types';

interface LocationFrequencyChartProps {
  data: LocationFrequency[];
  title: string;
}

export function LocationFrequencyChart({
  data,
  title,
}: LocationFrequencyChartProps) {
  const chartData = data.slice(0, 10).map((location) => ({
    name:
      location.location.length > 20
        ? location.location.substring(0, 20) + '...'
        : location.location,
    count: location.count,
  }));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} mb="md">
        {title}
      </Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" name="Frecuencia" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
