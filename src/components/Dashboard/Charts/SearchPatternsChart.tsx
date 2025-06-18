import { Card, Title, Box, Select } from '@mantine/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';

interface SearchPatternsChartProps {
  hourlyData: number[];
  dailyData: number[];
  title: string;
}

export function SearchPatternsChart({
  hourlyData,
  dailyData,
  title,
}: SearchPatternsChartProps) {
  const [timeRange, setTimeRange] = useState<'hourly' | 'daily'>('hourly');

  const hourlyChartData = hourlyData.map((value, index) => ({
    hour: `${index}:00`,
    searches: value,
  }));

  const dailyChartData = dailyData.map((value, index) => ({
    day: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][index],
    searches: value,
  }));

  const chartData = timeRange === 'hourly' ? hourlyChartData : dailyChartData;
  const xAxisKey = timeRange === 'hourly' ? 'hour' : 'day';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <Title order={3}>{title}</Title>
        <Select
          value={timeRange}
          onChange={(value) => setTimeRange(value as 'hourly' | 'daily')}
          data={[
            { value: 'hourly', label: 'Por Hora' },
            { value: 'daily', label: 'Por Día' },
          ]}
          w={150}
        />
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="searches"
            stroke="#8884d8"
            strokeWidth={2}
            name="Búsquedas"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
