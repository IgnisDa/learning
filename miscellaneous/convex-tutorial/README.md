# Convex Tutorial Application

An application built with React, Convex, and TypeScript. Features user authentication and self-hosted backend.

## Features

- **User authentication** - Email/password sign up and sign in
- **Self-hosted Convex backend** - Run your own Convex instance

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

The `npm run dev` command automatically:
1. Checks for required Convex environment variables (`JWT_PRIVATE_KEY`, `JWKS`)
2. Generates and sets them if missing
3. Initializes the Convex backend
4. Starts both the frontend and backend in parallel

The app will be available at `http://localhost:5173`

### Manual Auth Configuration

If you need to manually configure authentication environment variables:

```bash
npm run configure-auth
```

This script will check and configure:
- `JWT_PRIVATE_KEY` - RSA private key for JWT signing
- `JWKS` - JSON Web Key Set for token verification

### Resetting Environment

If you delete `~/.convex/anonymous-convex-backend-state/`, the environment variables will be cleared. Simply run `npm run dev` again to automatically reconfigure them.

## Usage

1. **Sign up** - Create an account with your email and password
2. **Access the application** - Once authenticated, you'll see the main dashboard

## Project Structure

```
convex-tutorial/
  src/               # React frontend
    components/      # Auth components
    App.tsx         # Main application interface
  convex/           # Convex backend
    auth.ts         # Authentication logic
    schema.ts       # Database schema
  scripts/          # Development utilities
  deployment/       # Docker deployment files
```

## Development Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend (Vite)
- `npm run dev:backend` - Start only the backend (Convex)
- `npm run configure-auth` - Manually configure auth environment variables
- `npm run build` - Build the production bundle

## Deployment

For Docker deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Convex (self-hosted)
- **Auth**: @convex-dev/auth with JWT
- **Deployment**: Docker, Caddy
