import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Title,
  Text,
  Box,
  Paper,
  Stack,
  Skeleton,
  Alert,
  Button,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconUsers,
  IconMapPin,
  IconSearch,
  IconRefresh,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useDashboardStore } from '../../store/dashboard/dashboardStore';
import { StatsCard } from '../../components/Dashboard/StatsCard';
import { UserActivityChart } from '../../components/Dashboard/Charts/UserActivityChart';
import { SearchPatternsChart } from '../../components/Dashboard/Charts/SearchPatternsChart';
import { LocationFrequencyChart } from '../../components/Dashboard/Charts/LocationFrequencyChart';
import { GrowthChart } from '../../components/Dashboard/Charts/GrowthChart';

export default function Dashboard() {
  const {
    stats,
    userFrequency,
    loading,
    errors,
    getStats,
    getUserFrequency,
    clearError,
  } = useDashboardStore();

  // Inicializar fechas al último mes
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  lastMonth.setDate(today.getDate());
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    lastMonth,
    today,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange[0] || !dateRange[1]) {
        clearError();
        return;
      }
      try {
        await Promise.all([
          getStats(dateRange[0].toISOString(), dateRange[1].toISOString()),
          getUserFrequency(
            dateRange[0].toISOString(),
            dateRange[1].toISOString(),
          ),
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, [getStats, getUserFrequency, dateRange]);

  const handleRefresh = async () => {
    clearError();
    if (!dateRange[0] || !dateRange[1]) return;
    try {
      await Promise.all([
        getStats(dateRange[0].toISOString(), dateRange[1].toISOString()),
        getUserFrequency(
          dateRange[0].toISOString(),
          dateRange[1].toISOString(),
        ),
      ]);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  };

  if (loading.stats || loading.userFrequency) {
    return (
      <Container size="xl" py="xl">
        <Title order={1} mb="xl">
          Panel de Control
        </Title>
        <Grid>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid.Col key={index} span={4}>
              <Skeleton height={120} radius="md" />
            </Grid.Col>
          ))}
          {Array.from({ length: 2 }).map((_, index) => (
            <Grid.Col key={index} span={6}>
              <Skeleton height={400} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    );
  }

  if (errors.length > 0) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error al cargar datos"
          color="red"
          mb="md"
        >
          {errors[0]}
        </Alert>
        <Button onClick={handleRefresh}>
          <IconRefresh size={16} style={{ marginRight: '8px' }} />
          Reintentar
        </Button>
      </Container>
    );
  }

  if (!stats || !userFrequency) {
    return (
      <Container size="xl" py="xl">
        <Text>No hay datos disponibles</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <Title order={1}>Panel de Control</Title>
          <Text c="dimmed" size="sm">
            Última actualización:{' '}
            {stats ? new Date(stats.lastUpdated).toLocaleString('es-ES') : ''}
          </Text>
        </div>
        <Box style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <DatePickerInput
            type="range"
            value={dateRange}
            onChange={setDateRange}
            maxDate={today}
            locale="es"
            size="sm"
            style={{ minWidth: 260 }}
            dropdownType="popover"
            clearable={false}
            withAsterisk
            valueFormat="DD/MM/YYYY"
          />
          <Button
            onClick={handleRefresh}
            disabled={!dateRange[0] || !dateRange[1]}
          >
            <IconRefresh size={16} style={{ marginRight: '8px' }} />
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* Cards de estadísticas principales */}
      <Grid mb="xl">
        <Grid.Col span={4}>
          <StatsCard
            title="Total Usuarios"
            value={stats.growth.totalUsers}
            icon={IconUsers}
            color="blue"
            description="Usuarios registrados"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <StatsCard
            title="Parqueaderos"
            value={stats.growth.totalParkingLots}
            icon={IconMapPin}
            color="green"
            description="Parqueaderos disponibles"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <StatsCard
            title="Búsquedas Totales"
            value={stats.userUsage.searchPatterns.totalSearches}
            icon={IconSearch}
            color="orange"
            description="Búsquedas realizadas"
          />
        </Grid.Col>
      </Grid>

      {/* Gráficas principales */}
      <Grid mb="xl">
        <Grid.Col span={6}>
          <UserActivityChart
            data={stats.userUsage.topUsers}
            title="Usuarios Más Activos"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <SearchPatternsChart
            hourlyData={stats.userUsage.searchPatterns.hourly}
            dailyData={stats.userUsage.searchPatterns.daily}
            title="Patrones de Búsqueda"
          />
        </Grid.Col>
      </Grid>

      <Grid mb="xl">
        <Grid.Col span={6}>
          <LocationFrequencyChart
            data={stats.userUsage.locationFrequency}
            title="Ubicaciones Más Frecuentes"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <GrowthChart
            data={stats.growth.monthlyGrowth}
            title="Crecimiento Mensual"
          />
        </Grid.Col>
      </Grid>

      {/* Estadísticas adicionales */}
      <Grid>
        <Grid.Col span={6}>
          <Paper shadow="sm" p="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Parqueaderos Más Visitados
            </Title>
            <Stack>
              {stats.parkingLots.mostVisited.slice(0, 5).map((parkingLot) => (
                <Box
                  key={parkingLot.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <Text fw={500} size="sm">
                      {parkingLot.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {parkingLot.address}
                    </Text>
                  </div>
                  <Box
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <Text size="sm" fw={500}>
                      {parkingLot.totalVisits} visitas
                    </Text>
                    <Text size="xs" c="dimmed">
                      ${parkingLot.price}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Paper shadow="sm" p="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Resumen de Interacciones
            </Title>
            <Stack>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <Text>Reportes Totales</Text>
                <Text fw={500}>{stats.interactions.totalReports}</Text>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <Text>Búsquedas con Filtros</Text>
                <Text fw={500}>{stats.interactions.searchesWithFilters}</Text>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <Text>Reportes Pendientes</Text>
                <Text fw={500}>{stats.interactions.pendingReports}</Text>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <Text>Reportes Resueltos</Text>
                <Text fw={500}>{stats.interactions.resolvedReports}</Text>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Distancia Promedio</Text>
                <Text fw={500}>
                  {stats.behavior.averageDistance.toFixed(1)} mt
                </Text>
              </Box>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
