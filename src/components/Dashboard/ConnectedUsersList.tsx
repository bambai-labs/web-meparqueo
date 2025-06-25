import { useEffect, useState } from 'react';
import { Paper, Title, Text, List, Badge, Box, Skeleton } from '@mantine/core';
import { IconUsers, IconWifi, IconClock } from '@tabler/icons-react';
import { useLocationStore } from '../../store/location/locationStore';
import { UserLocation } from '../../types/api';

interface ConnectedUsersListProps {
  title?: string;
}

export function ConnectedUsersList({ title = 'Usuarios Conectados' }: ConnectedUsersListProps) {
  const { locations, loading } = useLocationStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar la hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: Date) => {
    const diff = currentTime.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={3} mb="md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconUsers size={20} />
          {title}
        </Title>
        <Skeleton height={300} radius="md" />
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title order={3} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconUsers size={20} />
          {title}
        </Title>
        <Badge color="green" variant="light">
          {locations.length} conectados
        </Badge>
      </Box>

      {locations.length === 0 ? (
        <Box style={{ textAlign: 'center', padding: '40px 20px' }}>
          <IconUsers size={48} style={{ color: '#ccc', marginBottom: '16px' }} />
          <Text c="dimmed">No hay usuarios conectados</Text>
        </Box>
      ) : (
        <List spacing="sm">
          {locations.map((location: UserLocation) => (
            <List.Item
              key={location.user.id}
              style={{
                padding: '12px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            >
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <Text fw={600} size="sm">
                    {location.user.person.names} {location.user.person.lastNames}
                  </Text>
                  <Text c="dimmed" size="xs" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <IconWifi size={12} />
                    {location.user.person.email}
                  </Text>
                  <Text c="dimmed" size="xs" style={{ marginTop: '2px' }}>
                    {location.user.person.phone}
                  </Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge 
                    color={location.user.role === 'ADMIN' ? 'red' : 'blue'} 
                    variant="light" 
                    size="xs"
                    style={{ marginBottom: '4px' }}
                  >
                    {location.user.role}
                  </Badge>
                  <Text c="dimmed" size="xs" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconClock size={10} />
                    {formatTimeAgo(location.timestamp)}
                  </Text>
                </div>
              </Box>
            </List.Item>
          ))}
        </List>
      )}
    </Paper>
  );
} 