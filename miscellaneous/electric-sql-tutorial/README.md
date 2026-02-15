# Electric SQL Tutorial - TV Show Tracker

A full-stack TV show tracking application built with **Electric SQL**, **PostgreSQL**, **Drizzle ORM**, **Hono**, and **TanStack Start**. This is a replication of the convex-tutorial application showcasing the same features with a different tech stack.

## Features

- **User Authentication**: Sign up, sign in, and session management with JWT
- **TV Show Search**: Search the TMDB catalog for TV shows
- **Show Library**: Add shows to your personal library
- **Detailed Show Information**:
  - Show metadata (name, overview, poster)
  - Seasons and episodes with details
  - Cast and crew information
  - Episode-level guest stars and crew
- **Real-time Sync**: Electric SQL for real-time database synchronization
- **Modern UI**: Clean, Notion-inspired interface with TailwindCSS

## Tech Stack

### Backend
- **PostgreSQL 15**: Relational database
- **Electric SQL**: Real-time sync layer
- **Drizzle ORM**: Type-safe database ORM
- **Hono**: Fast, lightweight API framework
- **bcryptjs**: Password hashing
- **JWT**: Authentication tokens

### Frontend
- **React 19**: UI library
- **TanStack Start**: Full-stack React framework with SSR
- **TanStack Router**: Type-safe routing
- **TanStack Query**: Server state management
- **TailwindCSS 4**: Utility-first CSS

### External APIs
- **TMDB API**: Movie/TV show data

## Project Structure

```
electric-sql-tutorial/
├── drizzle/                    # Database schema & migrations
│   ├── schema.ts              # Drizzle schema (8 tables)
│   ├── config.ts              # Drizzle configuration
│   └── migrations/            # SQL migrations
├── server/                    # Backend API (Hono)
│   ├── index.ts               # Main server file
│   ├── db.ts                  # Drizzle client
│   ├── auth/                  # Authentication
│   │   ├── jwt.ts            # JWT utilities
│   │   ├── routes.ts         # Auth endpoints
│   │   └── middleware.ts     # Auth middleware
│   ├── tmdb/                  # TMDB integration
│   │   ├── client.ts         # TMDB API client
│   │   ├── routes.ts         # TMDB endpoints
│   │   ├── import.ts         # Data import logic
│   │   └── types.ts          # TypeScript types
│   └── queries/               # Data query endpoints
│       └── routes.ts          # Query endpoints
├── electric/                  # Electric SQL client
│   ├── client.ts              # Electric client setup
│   └── hooks.ts               # React hooks for Electric
├── src/                       # Frontend (TanStack Start)
│   ├── router.tsx             # Router configuration
│   ├── routes/
│   │   ├── __root.tsx         # Root layout
│   │   ├── signin.tsx         # Sign in page
│   │   ├── signup.tsx         # Sign up page
│   │   └── _dashboard/        # Protected routes
│   │       ├── route.tsx      # Auth guard
│   │       ├── index.tsx      # My shows
│   │       ├── search.tsx     # Search shows
│   │       └── show.$id.tsx   # Show details
│   ├── components/
│   │   └── DashboardLayout.tsx
│   ├── utils/
│   │   ├── cookies.ts         # Cookie utilities
│   │   └── api.ts             # API client
│   └── styles/
│       └── index.css          # Global styles
├── docker-compose.yml         # Docker services
├── Dockerfile                 # Production build
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
└── .env.local                 # Environment variables
```

## Database Schema

The application uses 8 PostgreSQL tables:

1. **users**: User accounts
2. **sessions**: Authentication sessions
3. **shows**: TV show records
4. **user_shows**: User's show library (junction table)
5. **seasons**: Season information
6. **episodes**: Episode details with cast/crew (JSONB)
7. **persons**: People (actors, crew members)
8. **credits**: Show-level credits

## Quick Start

### Prerequisites

- Node.js 20+ and npm/yarn
- Docker and Docker Compose
- TMDB API key (already included in .env.local)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd miscellaneous/electric-sql-tutorial
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Docker services** (PostgreSQL + Electric SQL):
   ```bash
   npm run docker:up
   ```

   This starts:
   - PostgreSQL on port `5432`
   - Electric SQL on port `5133`

4. **Generate and run database migrations**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the API server** (in a separate terminal):
   ```bash
   node server/index.ts
   ```

   The API runs on `http://localhost:3002`

6. **Start the development server**:
   ```bash
   npm run dev:app
   ```

   The app runs on `http://127.0.0.1:3001`

7. **Open your browser**:
   Navigate to `http://127.0.0.1:3001`

## Development

### Available Scripts

```bash
# Start all services (Docker + app)
npm run dev

# Start just the app
npm run dev:app

# Start just Docker services
npm run docker:up

# Stop Docker services
npm run docker:down

# Reset database (delete all data)
npm run docker:reset

# Database operations
npm run db:generate     # Generate migrations from schema
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:studio       # Open Drizzle Studio (GUI)

# Type checking
npm run typecheck

# Build for production
npm run build
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tv_tracker

# Electric SQL
VITE_ELECTRIC_URL=http://localhost:5133

# API Server
API_PORT=3002
VITE_API_URL=http://localhost:3002

# App
VITE_SITE_URL=http://localhost:3001

# JWT Secret (change in production!)
JWT_SECRET=change-this-in-production-use-a-long-random-string

# TMDB API Key
TMDB_API_KEY=your_tmdb_api_key_here
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user

### TMDB
- `GET /api/tmdb/search?q=query` - Search TV shows
- `POST /api/tmdb/shows` - Add show to library
- `POST /api/tmdb/shows/:showId/refresh` - Refresh show data

### Queries
- `GET /api/queries/my-shows` - Get user's shows
- `GET /api/queries/shows/:showId` - Get show details

## How It Works

### Authentication Flow
1. User signs up/signs in via the API
2. Server creates a session with a random token
3. Token stored in cookie (`auth_token`)
4. All protected routes check for valid session

### TMDB Integration
1. User searches for a TV show
2. API proxies request to TMDB
3. User adds show to their library
4. Background job fetches full show data:
   - Show metadata
   - All seasons and episodes
   - Cast and crew for the show
   - Guest stars and crew for each episode
5. Data stored in PostgreSQL
6. Electric SQL syncs changes to frontend

### Real-time Sync (Electric SQL)
- Electric SQL creates a sync layer between PostgreSQL and clients
- Changes in the database are automatically pushed to connected clients
- Provides reactive queries via the Electric client

## Production Deployment

### Docker

Build and run with Docker:

```bash
# Build the image
docker build -t electric-sql-tutorial .

# Run with docker-compose
docker-compose up -d
```

### Manual Deployment

1. Set up PostgreSQL database
2. Set up Electric SQL sync service
3. Configure environment variables
4. Run migrations: `npm run db:migrate`
5. Build the app: `npm run build`
6. Start the API server: `node server/index.ts`
7. Start the app server: `npm start`

## Differences from Convex Version

| Aspect | Convex Version | Electric SQL Version |
|--------|----------------|---------------------|
| **Database** | Convex (proprietary) | PostgreSQL + Electric SQL |
| **ORM** | Convex schema | Drizzle ORM |
| **Backend** | Convex functions | Hono API server |
| **Auth** | Convex auth | JWT + sessions |
| **Real-time** | Built-in | Electric SQL sync |
| **Queries** | `useQuery(api.func)` | React Query + API calls |
| **Migrations** | Automatic | Drizzle Kit migrations |

## Troubleshooting

### Docker issues

If Docker services won't start:
```bash
npm run docker:down
npm run docker:up
```

### Database connection errors

1. Check if PostgreSQL is running: `docker ps`
2. Check connection string in `.env.local`
3. Try resetting the database: `npm run docker:reset`

### Migration errors

If migrations fail:
```bash
# Delete existing migrations
rm -rf drizzle/migrations/*.sql

# Regenerate
npm run db:generate

# Push to database
npm run db:push
```

### API not responding

1. Check if API server is running on port 3002
2. Check CORS settings in `server/index.ts`
3. Verify `VITE_API_URL` in `.env.local`

## License

This is a tutorial project. Feel free to use it for learning purposes.

## Credits

- Original Convex version design and features
- TMDB for TV show data
- Electric SQL for real-time sync capabilities
