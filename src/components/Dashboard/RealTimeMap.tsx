import { useEffect, useRef, useState } from 'react';
import { Box, Paper, Title, Text, Badge, Skeleton, Alert, Button } from '@mantine/core';
import { IconMapPin, IconRefresh, IconAlertCircle, IconWifi, IconWifiOff } from '@tabler/icons-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './RealTimeMap.css';
import { useLocationStore } from '../../store/location/locationStore';
import { UserLocation } from '../../types/api';

// Configurar el token de Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface RealTimeMapProps {
  title?: string;
}

export function RealTimeMap({ title = 'Mapa en Tiempo Real' }: RealTimeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  
  const { locations, loading, error, isConnected, connect, disconnect, fetchLocations, clearError } = useLocationStore();
  
  const [mapLoaded, setMapLoaded] = useState(false);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.0817, 4.6097], // Bogotá, Colombia
      zoom: 12,
      attributionControl: false,
    });

    // Agregar controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Escuchar cuando el mapa se carga
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Limpiar al desmontar
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Conectar al socket cuando el componente se monta
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Actualizar marcadores cuando cambian las ubicaciones
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Limpiar marcadores existentes
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Crear nuevos marcadores
    locations.forEach((location: UserLocation) => {
      const el = document.createElement('div');
      el.className = 'user-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#228be6';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                ${location.user.person.names} ${location.user.person.lastNames}
              </h4>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
                <strong>Email:</strong> ${location.user.person.email}
              </p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
                <strong>Teléfono:</strong> ${location.user.person.phone}
              </p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
                <strong>Rol:</strong> ${location.user.role}
              </p>
              <p style="margin: 0; font-size: 11px; color: #999;">
                Última actualización: ${new Date(location.timestamp).toLocaleString('es-ES')}
              </p>
            </div>
          `)
        );

      if (map.current) {
        marker.addTo(map.current);
      }

      markers.current[location.user.id] = marker;
    });

    // Ajustar vista si hay ubicaciones
    if (locations.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach((location: UserLocation) => {
        bounds.extend([location.longitude, location.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [locations, mapLoaded]);

  const handleRefresh = () => {
    clearError();
    fetchLocations();
  };

  if (loading && locations.length === 0) {
    return (
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={3} mb="md">
          {title}
        </Title>
        <Skeleton height={400} radius="md" />
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <Title order={3} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconMapPin size={20} />
            {title}
          </Title>
          <Text c="dimmed" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            {isConnected ? (
              <>
                <IconWifi size={14} style={{ color: '#40c057' }} />
                Conectado • {locations.length} usuarios en línea
              </>
            ) : (
              <>
                <IconWifiOff size={14} style={{ color: '#fa5252' }} />
                Desconectado
              </>
            )}
          </Text>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Badge 
            color={isConnected ? 'green' : 'red'} 
            variant="light"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {isConnected ? 'En línea' : 'Desconectado'}
          </Badge>
          <Button size="xs" onClick={handleRefresh} disabled={loading}>
            <IconRefresh size={14} />
          </Button>
        </div>
      </Box>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error de conexión"
          color="red"
          mb="md"
          withCloseButton
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      <Box
        ref={mapContainer}
        style={{
          height: '400px',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />

      {locations.length === 0 && !loading && (
        <Box style={{ textAlign: 'center', padding: '40px 20px' }}>
          <IconMapPin size={48} style={{ color: '#ccc', marginBottom: '16px' }} />
          <Text c="dimmed">No hay usuarios conectados en este momento</Text>
        </Box>
      )}
    </Paper>
  );
} 