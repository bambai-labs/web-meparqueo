# Configuración del Mapa en Tiempo Real

## Variables de Entorno Requeridas

Para que el mapa en tiempo real funcione correctamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env`:

```env
# URL del servidor de sockets
VITE_SOCKET_URL=http://localhost:3000

# Token de Mapbox (necesario para el mapa en tiempo real)
VITE_MAPBOX_TOKEN=tu_token_de_mapbox_aqui

# URL de la API
VITE_API_URL=http://localhost:3000/api
```

## Obtener Token de Mapbox

1. Ve a [Mapbox](https://www.mapbox.com/) y crea una cuenta gratuita
2. Una vez registrado, ve a tu dashboard
3. En la sección "Access tokens", copia tu token público
4. Reemplaza `tu_token_de_mapbox_aqui` con tu token real

## Funcionalidades del Mapa

### Características Implementadas

- **Visualización en tiempo real**: Muestra las ubicaciones de todos los usuarios conectados
- **Marcadores interactivos**: Cada usuario tiene un marcador con información detallada
- **Actualizaciones automáticas**: Las ubicaciones se actualizan automáticamente cuando los usuarios se mueven
- **Estado de conexión**: Indica si el socket está conectado o desconectado
- **Información de usuario**: Al hacer clic en un marcador, se muestra:
  - Nombre completo del usuario
  - Email
  - Teléfono
  - Rol
  - Última actualización de ubicación

### Eventos de WebSocket

El componente maneja automáticamente los siguientes eventos:

- `all_locations`: Recibe todas las ubicaciones actuales
- `location_updated`: Actualiza la ubicación de un usuario específico
- `user_connected`: Agrega un nuevo usuario al mapa
- `user_disconnected`: Remueve un usuario del mapa

### Personalización

Puedes personalizar el mapa modificando:

- **Estilo del mapa**: Cambia `mapbox://styles/mapbox/streets-v12` por otros estilos disponibles
- **Centro inicial**: Modifica las coordenadas en `center: [-74.0817, 4.6097]` (Bogotá)
- **Zoom inicial**: Ajusta el valor de `zoom: 12`
- **Apariencia de marcadores**: Modifica los estilos en `RealTimeMap.css`

## Solución de Problemas

### El mapa no se carga
- Verifica que `VITE_MAPBOX_TOKEN` esté configurado correctamente
- Asegúrate de que el token tenga permisos para el estilo de mapa que estás usando

### No se muestran ubicaciones
- Verifica que `VITE_SOCKET_URL` apunte al servidor correcto
- Asegúrate de que el servidor esté ejecutándose y el endpoint de sockets esté disponible
- Verifica que tengas permisos de administrador para acceder a las ubicaciones

### Errores de conexión
- Revisa la consola del navegador para errores específicos
- Verifica que el servidor de sockets esté configurado correctamente
- Asegúrate de que la autenticación JWT esté funcionando

## Notas Importantes

1. **Autenticación**: El componente requiere que el usuario esté autenticado como administrador
2. **Persistencia**: Las ubicaciones en tiempo real se almacenan en memoria del servidor
3. **Limpieza**: Los marcadores se limpian automáticamente cuando los usuarios se desconectan
4. **Rendimiento**: El mapa se optimiza para manejar múltiples usuarios simultáneamente 