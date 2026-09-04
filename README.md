# ♟️ ChessLive

> **⚠️ Proyecto en desarrollo activo.** La API, el esquema de base de datos y los eventos de WebSocket pueden cambiar sin previo aviso.

Backend de una plataforma de ajedrez en tiempo real, escrito en **TypeScript** siguiendo una arquitectura modular inspirada en Clean/Hexagonal Architecture (dominio, aplicación e infraestructura separados por módulo). Permite autenticación de usuarios, emparejamiento de partidas en vivo mediante cola (matchmaking) y comunicación en tiempo real vía WebSockets.

## ✨ Características

- 🔐 **Autenticación** con JWT (access/refresh tokens), sesiones persistidas y bloqueo (lock) de intentos vía Redis.
- 👤 **Gestión de usuarios**, incluyendo sistema de rating/puntuación.
- ♟️ **Motor de partidas** basado en [`chess.js`](https://www.npmjs.com/package/chess.js).
- 🎮 **Módulo "live"**: búsqueda de partida (matchmaking en cola con Redis), movimientos, rendición, cancelación y obtención de estado de partida.
- 🔌 **WebSocket Server** propio con sistema de salas (rooms) para la comunicación en tiempo real.
- ✉️ **Envío de correo** (recuperación de contraseña) con Nodemailer, con un servicio "fake" para entornos de desarrollo/test.
- 🛡️ Seguridad HTTP con Helmet, CORS configurable, cookies y logging estructurado (Pino).
- 🗄️ Persistencia en **PostgreSQL** (TypeORM) y caché/colas en **Redis**.
- 💉 Inyección de dependencias con `tsyringe`.

## 🧱 Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Lenguaje | TypeScript |
| Runtime | Node.js 24 |
| Framework HTTP | Express 5 |
| Base de datos | PostgreSQL (TypeORM) |
| Caché / Colas | Redis |
| Tiempo real | WebSocket (`ws`) |
| Autenticación | JWT + Argon2 |
| Ajedrez | chess.js |
| Correo | Nodemailer |
| Logging | Pino |
| Testing | Jest |
| Lint / Formato | ESLint + Prettier |
| Contenedores | Docker |

## 📁 Estructura del proyecto

```
src/
├── index.ts                 # Punto de entrada de la aplicación
├── infrastructure/          # Servidor HTTP, WebSocket, config, workers, handlers
└── modules/
    ├── auth/                 # Login, registro, sesiones, tokens
    ├── user/                 # Entidad usuario, ratings, repositorio
    ├── game/                 # Entidad de partida
    ├── live/                 # Matchmaking, movimientos, estado en vivo
    └── mail/                 # Envío de correos (recuperación de contraseña, etc.)
```

Cada módulo sigue (o tiende a seguir) la separación:
- `domain/` — entidades e interfaces (contratos), sin dependencias externas.
- `application/` — casos de uso y DTOs.
- `infrastructure/` — implementaciones concretas (repositorios Postgres, controladores HTTP, servicios externos).

## 🚀 Puesta en marcha

### Requisitos previos

- Node.js 24+
- PostgreSQL
- Redis

### Instalación

```bash
git clone <url-del-repositorio>
cd ChessLive
npm install
```

### Configuración

Copia el archivo de ejemplo y completa las variables necesarias:

```bash
cp .env.example .env
```

Variables principales:

| Variable | Descripción |
|---|---|
| `NODE_ENV` | `development` o `production` |
| `TCP_PORT` | Puerto donde escucha el servidor (por defecto `8080`) |
| `LOG_LEVEL` | Nivel de logging (`error`, `warn`, `info`, `debug`, `verbose`) |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `REDIS_URL` | Cadena de conexión a Redis |
| `JWT_SECRET` | Secreto para firmar los JWT |
| `PASSWORD_ENCRYPT_LEVEL` | Nivel de coste de Argon2 (`low`, `medium`, `high`) |
| `ALLOWED_ORIGINS` | Orígenes permitidos por CORS (separados por comas) |
| `HTTPS` | `true`/`false` según protocolo del backend |
| `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD` | Credenciales del admin inicial (seed) |

### Ejecución en desarrollo

```bash
npm run dev
```

### Build y ejecución en producción

```bash
npm run build
npm start
```

### Con Docker

```bash
docker build -t chesslive .
docker run --env-file .env -p 8080:8080 chesslive
```

### Tests, lint y formato

```bash
npm test          # Ejecuta los tests con Jest
npm run lint       # Revisa el código con ESLint
npm run lint:fix    # Corrige automáticamente lo que se pueda
npm run fmt        # Formatea el código con Prettier
```

## 📡 API

### HTTP

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/auth/login` | Inicio de sesión |
| `POST` | `/auth/register` | Registro de usuario |
| `POST` | `/auth/refresh` | Renovación de tokens |
| `POST` | `/auth/logout` | Cierre de sesión |

### WebSocket

El servidor acepta conexiones WebSocket con un sistema de suscripción a salas. Un cliente puede unirse a una sala enviando:

```json
{ "subscribe": "nombre-de-la-sala" }
```

La lógica de partidas en vivo (búsqueda de rival, movimientos, rendición, cancelación, estado de partida) se gestiona a través del módulo `live`.

> Nota: la documentación detallada de eventos y payloads de WebSocket está pendiente, ya que el proyecto sigue en desarrollo.

## 🗺️ Roadmap / Estado actual

Este proyecto está en construcción. Algunas áreas que aún están en progreso o pendientes:

- [ ] Documentación completa de la API HTTP (OpenAPI/Swagger).
- [ ] Documentación de los eventos de WebSocket del módulo `live`.
- [ ] Cobertura de tests más amplia.
- [ ] Endpoints públicos de perfil de usuario y ranking.
- [ ] Frontend / cliente (no incluido en este repositorio).
- [ ] Migraciones de base de datos documentadas.

## 🤝 Contribuciones

Al ser un proyecto en desarrollo activo, las contribuciones, issues y sugerencias son bienvenidas. Antes de abrir un PR, ejecuta `npm run lint` y `npm test`.

## 📄 Licencia

Sin definir aún.