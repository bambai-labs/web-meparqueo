import { create } from 'zustand';
import { socket } from '../../config/socket';
import { UserLocation, LocationUpdate, UserConnection } from '../../types/api';

interface LocationState {
  locations: UserLocation[];
  connectedUsers: UserConnection[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  fetchLocations: () => void;
  updateLocation: (latitude: number, longitude: number) => void;
  clearError: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  locations: [],
  connectedUsers: [],
  loading: false,
  error: null,
  isConnected: false,

  connect: () => {
    const { fetchLocations } = get();
    
    // Conectar al socket
    socket.connect();
    
    // Solicitar ubicaciones actuales
    socket.emit('get_all_locations');
    
    // Escuchar ubicaciones actuales
    socket.on('all_locations', (locations: UserLocation[]) => {
      set({ locations, isConnected: true });
    });

    // Escuchar actualizaciones de ubicación
    socket.on('location_updated', (location: LocationUpdate) => {
      set((state) => {
        const existingIndex = state.locations.findIndex(
          (loc) => loc.user.id === location.userId
        );
        
        if (existingIndex >= 0) {
          // Actualizar ubicación existente
          const updatedLocations = [...state.locations];
          updatedLocations[existingIndex] = {
            ...updatedLocations[existingIndex],
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.timestamp,
          };
          return { locations: updatedLocations };
        } else {
          // Agregar nueva ubicación (esto no debería pasar normalmente)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return { locations: [...state.locations, location as any] };
        }
      });
    });

    // Escuchar conexiones de usuarios
    socket.on('user_connected', (user: UserConnection) => {
      set((state) => ({
        connectedUsers: [...state.connectedUsers, user],
      }));
    });

    // Escuchar desconexiones de usuarios
    socket.on('user_disconnected', (data: { userId: string }) => {
      set((state) => ({
        connectedUsers: state.connectedUsers.filter(
          (user) => user.userId !== data.userId
        ),
        locations: state.locations.filter(
          (location) => location.user.id !== data.userId
        ),
      }));
    });

    // Escuchar errores de conexión
    socket.on('connect_error', (error) => {
      console.error(error);
      set({ error: 'Error de conexión al socket', isConnected: false });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    fetchLocations();
  },

  disconnect: () => {
    socket.disconnect();
    set({ isConnected: false, locations: [], connectedUsers: [] });
  },

  fetchLocations: () => {
    set({ loading: true });
    socket.emit('get_all_locations');
    set({ loading: false });
  },

  updateLocation: (latitude: number, longitude: number) => {
    socket.emit('update_location', { latitude, longitude });
  },

  clearError: () => {
    set({ error: null });
  },
})); 