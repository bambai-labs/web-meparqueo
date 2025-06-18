import { Card, Text, ThemeIcon, Box } from '@mantine/core';
import { IconProps } from '@tabler/icons-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<IconProps>;
  color: string;
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  description,
}: StatsCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <Text fw={500} size="sm" c="dimmed">
          {title}
        </Text>
        <ThemeIcon variant="light" color={color} size="lg">
          <Icon size={20} />
        </ThemeIcon>
      </Box>

      <Text fw={700} size="xl">
        {value}
      </Text>

      {description && (
        <Text size="xs" c="dimmed" mt="xs">
          {description}
        </Text>
      )}
    </Card>
  );
}
