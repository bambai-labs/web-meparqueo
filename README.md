# web-meparqueo

Panel web de administración de MeParqueo: dashboard de métricas y gestión de usuarios, nodos IoT y parqueaderos en tiempo real.

## Parte del ecosistema MeParqueo

Sistema IoT de parqueo inteligente en tiempo real (Montería, Colombia).

| Repo | Descripción | Acceso |
|------|-------------|--------|
| [app-meparqueo](https://github.com/bambai-labs/app-meparqueo) | App móvil React Native para conductores | Público |
| api-meparqueo | Backend NestJS | Privado |
| nodo-meparqueo | Firmware del sensor ESP32 (LoRaWAN) | Privado |
| **web-meparqueo** | Panel web de administración (este repo) | Privado |
| landing-meparqueo | Landing page | Privado |
| survey-meparqueo | Encuestas y validación | Privado |

## ✨ Características

- **Autenticación con roles**: login con JWT (Bearer) y rutas protegidas por rol (`ADMIN`, `OWNER`) vía `ProtectedRoute`.
- **Dashboard de métricas**: tarjetas de estadísticas y gráficas Recharts (actividad de usuarios, patrones de búsqueda, frecuencia por ubicación, crecimiento) filtrables por rango de fechas.
- **Gestión de usuarios**: CRUD completo con cambio de contraseña y datos de persona asociada.
- **Gestión de nodos IoT**: CRUD de nodos sensores con código y versión de hardware (`BETA`, `V1`, `V2`).
- **Gestión de parqueaderos**: CRUD con ubicación en mapa (Mapbox GL), carga de imágenes con ordenamiento drag-and-drop (dnd-kit), estado (`OPEN`/`CLOSED`), disponibilidad, métodos de pago, servicios e historial de cambios en timeline.
- **Tiempo real**: conexión Socket.IO autenticada para reflejar cambios de estado al instante.
- **Configuración global**: versión mínima de la app móvil y banner promocional (enlace, color, imagen, visibilidad).

## 🛠️ Stack

- **React 18 + TypeScript + Vite** (plugin SWC)
- **Mantine 6** (core, forms, dates, notifications) + **mantine-react-table**
- **Zustand** para estado global por dominio (auth, users, nodes, parking lots, dashboard, config)
- **React Router 7** para rutas y protección por rol
- **Axios** con interceptor de token · **Socket.IO client**
- **Mapbox GL** (mapas) · **Recharts** (gráficas) · **dnd-kit** (drag & drop)
- ESLint + Prettier

## 📁 Estructura del proyecto

```
.github/workflows/   # Deploy automático a VPS en push a main
public/              # Estáticos (logo, _redirects para SPA)
src/
├── components/      # Sidenav, ProtectedRoute, CrudModel, charts del dashboard
├── config/          # Providers globales y cliente Socket.IO
├── helpers/         # Utilidades compartidas
├── pages/           # Login, 401, 404 y páginas del dashboard (usuarios, nodos, parqueaderos, config)
├── service/         # Cliente Axios con interceptor de autenticación
├── store/           # Stores Zustand por dominio + modelos y tipos
└── types/           # Endpoints de la API y tipos de respuesta
```

## 🚀 Desarrollo local

Requisitos: Node.js y npm.

```bash
# 1. Instalar dependencias
npm ci

# 2. Configurar variables de entorno
cp .env.example .env
```

Variables de entorno (solo nombres, ver `.env.example`):

- `VITE_API_BASE_URL` — URL base de la API (api-meparqueo)
- `VITE_SOCKET_URL` — URL del servidor Socket.IO
- `VITE_MAPBOX_TOKEN` — token de Mapbox GL

```bash
# 3. Levantar en desarrollo
npm run dev

# Otros comandos
npm run build    # tsc -b && vite build
npm run preview  # previsualizar el build
npm run lint     # ESLint
npm run format   # Prettier sobre src/
```

El deploy a producción se ejecuta automáticamente con GitHub Actions al hacer push a `main` (build en VPS vía SSH). Existen además configuraciones SPA para Netlify (`netlify.toml`) y Vercel (`vercel.json`).

## 👥 Hecho por bambai-labs

Proyecto desarrollado por el equipo de **bambai-labs** — Jose Gaspar ([@dev-gaspar](https://github.com/dev-gaspar)) y colegas.