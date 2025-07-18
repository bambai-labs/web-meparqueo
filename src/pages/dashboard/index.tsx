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
import { useMediaQuery } from '@mantine/hooks';

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

  const isMobile = useMediaQuery('(max-width: 768px)');

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
  }, [getStats, getUserFrequency, dateRange, clearError]);

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
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 16 : 0,
          marginBottom: isMobile ? 16 : 32,
        }}
      >
        <div>
          <Title order={1} size={isMobile ? 24 : 32}>Panel de Control</Title>
          <Text c="dimmed" size={isMobile ? 'xs' : 'sm'}>
            Última actualización:{' '}
            {stats ? new Date(stats.lastUpdated).toLocaleString('es-ES') : ''}
          </Text>
        </div>
        <Box
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
            alignItems: isMobile ? 'stretch' : 'center',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <DatePickerInput
            type="range"
            value={dateRange}
            onChange={setDateRange}
            maxDate={today}
            locale="es"
            size="sm"
            label="Rango de fechas"
            style={{ minWidth: isMobile ? '100%' : 260, width: isMobile ? '100%' : 'auto' }}
            dropdownType="popover"
            clearable={false}
            withAsterisk
            valueFormat="DD/MM/YYYY"
          />
          <Button
            onClick={handleRefresh}
            disabled={!dateRange[0] || !dateRange[1]}
            fullWidth={isMobile}
          >
            <IconRefresh size={16} style={{ marginRight: '8px' }} />
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* Cards de estadísticas principales */}
      <Grid mb="xl" gutter={isMobile ? 'xs' : 'xl'}>
        <Grid.Col span={isMobile ? 12 : 4}>
          <StatsCard
            title="Total Usuarios"
            value={stats.growth.totalUsers}
            icon={IconUsers}
            color="blue"
            description="Usuarios registrados"
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 4}>
          <StatsCard
            title="Parqueaderos"
            value={stats.growth.totalParkingLots}
            icon={IconMapPin}
            color="green"
            description="Parqueaderos disponibles"
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 4}>
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
      <Grid mb="xl" gutter={isMobile ? 'xs' : 'xl'}>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Box style={{ overflowX: 'auto' }}>
            <UserActivityChart
              data={stats.userUsage.topUsers}
              title="Usuarios Más Activos"
            />
          </Box>
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Box style={{ overflowX: 'auto' }}>
            <SearchPatternsChart
              hourlyData={stats.userUsage.searchPatterns.hourly}
              dailyData={stats.userUsage.searchPatterns.daily}
              title="Patrones de Búsqueda"
            />
          </Box>
        </Grid.Col>
      </Grid>

      <Grid mb="xl" gutter={isMobile ? 'xs' : 'xl'}>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Box style={{ overflowX: 'auto' }}>
            <LocationFrequencyChart
              data={stats.userUsage.locationFrequency}
              title="Ubicaciones Más Frecuentes"
            />
          </Box>
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Box style={{ overflowX: 'auto' }}>
            <GrowthChart
              data={stats.growth.monthlyGrowth}
              title="Crecimiento Mensual"
            />
          </Box>
        </Grid.Col>
      </Grid>

      {/* Estadísticas adicionales */}
      <Grid gutter={isMobile ? 'xs' : 'xl'}>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Paper shadow="sm" p={isMobile ? 'sm' : 'lg'} radius="md" withBorder>
            <Title order={3} mb="md" size={isMobile ? 16 : 20}>
              Parqueaderos Más Visitados
            </Title>
            <Stack spacing={isMobile ? 4 : 'md'}>
              {stats.parkingLots.mostVisited.slice(0, 5).map((parkingLot) => (
                <Box
                  key={parkingLot.id}
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    marginBottom: isMobile ? 4 : 8,
                    gap: isMobile ? 2 : 0,
                  }}
                >
                  <div>
                    <Text fw={500} size={isMobile ? 'xs' : 'sm'}>
                      {parkingLot.name}
                    </Text>
                    <Text size={isMobile ? 'xs' : 'xs'} c="dimmed">
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
                    <Text size={isMobile ? 'xs' : 'sm'} fw={500}>
                      {parkingLot.totalVisits} visitas
                    </Text>
                    <Text size={isMobile ? 'xs' : 'xs'} c="dimmed">
                      ${parkingLot.price}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Paper shadow="sm" p={isMobile ? 'sm' : 'lg'} radius="md" withBorder>
            <Title order={3} mb="md" size={isMobile ? 16 : 20}>
              Resumen de Interacciones
            </Title>
            <Stack spacing={isMobile ? 4 : 'md'}>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: isMobile ? 4 : 16,
                }}
              >
                <Text size={isMobile ? 'xs' : 'sm'}>Reportes Totales</Text>
                <Text fw={500} size={isMobile ? 'xs' : 'sm'}>{stats.interactions.totalReports}</Text>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: isMobile ? 4 : 16,
                }}
              >
                <Text size={isMobile ? 'xs' : 'sm'}>Búsquedas con Filtros</Text>
                <Text fw={500} size={isMobile ? 'xs' : 'sm'}>{stats.interactions.searchesWithFilters}</Text>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: isMobile ? 4 : 16,
                }}
              >
                <Text size={isMobile ? 'xs' : 'sm'}>Reportes Pendientes</Text>
                <Text fw={500} size={isMobile ? 'xs' : 'sm'}>{stats.interactions.pendingReports}</Text>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: isMobile ? 4 : 16,
                }}
              >
                <Text size={isMobile ? 'xs' : 'sm'}>Reportes Resueltos</Text>
                <Text fw={500} size={isMobile ? 'xs' : 'sm'}>{stats.interactions.resolvedReports}</Text>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text size={isMobile ? 'xs' : 'sm'}>Distancia Promedio</Text>
                <Text fw={500} size={isMobile ? 'xs' : 'sm'}>
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
