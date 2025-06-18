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
import { UserFrequency } from '../../../store/dashboard/types';

interface UserActivityChartProps {
  data: UserFrequency[];
  title: string;
}

export function UserActivityChart({ data, title }: UserActivityChartProps) {
  const chartData = data.slice(0, 10).map((user) => ({
    name: user.email.substring(0, 20) + '...',
    totalActions: user.totalActions,
    locationUpdates: user.locationUpdates,
    searches: user.searches,
    parkingLotVisits: user.parkingLotVisits,
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
          <Bar dataKey="totalActions" fill="#8884d8" name="Total Acciones" />
          <Bar
            dataKey="locationUpdates"
            fill="#82ca9d"
            name="Actualizaciones de Ubicación"
          />
          <Bar dataKey="searches" fill="#ffc658" name="Búsquedas" />
          <Bar
            dataKey="parkingLotVisits"
            fill="#ff7300"
            name="Visitas a Parqueaderos"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
