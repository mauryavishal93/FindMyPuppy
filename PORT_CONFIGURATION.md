# Port Configuration Explanation

## Port Overview

This application uses **two different ports** in development:

### 1. Port 5173 - Frontend (Vite Dev Server)
- **What**: Vite's default development server port
- **When**: When you run `npm run dev`
- **Purpose**: Serves the React frontend application
- **Why 5173**: This is Vite's default port (similar to how Create React App uses 3000)

### 2. Port 5774 - Backend (Express Server)
- **What**: Backend API server port
- **When**: When you run `npm run server` or `npm start`
- **Purpose**: Serves the Express.js backend API endpoints
- **Why 5774**: Custom port chosen for this application (configured in `server.js`)

## How They Work Together

```
┌─────────────────────────────────────────┐
│  Browser (User)                         │
│  http://localhost:5173                  │
└──────────────┬──────────────────────────┘
               │
               │ Requests (HTML, JS, CSS)
               │ API requests (/api/*)
               ▼
┌─────────────────────────────────────────┐
│  Vite Dev Server (Port 5173)            │
│  - Serves frontend files                │
│  - Proxies /api/* to backend            │
└──────────────┬──────────────────────────┘
               │
               │ Proxy /api/* requests
               ▼
┌─────────────────────────────────────────┐
│  Express Server (Port 5774)             │
│  - Handles /api/* endpoints             │
│  - Database connections                 │
│  - Authentication                       │
└─────────────────────────────────────────┘
```

## Configuration Files

### Frontend (Vite) - `vite.config.ts`
```typescript
server: {
  host: true,
  allowedHosts: true,
  proxy: {
    '/api': {
      target: 'http://localhost:5774',  // Proxies to backend
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Backend (Express) - `server.js`
```javascript
const PORT = process.env.PORT || 5774;  // Backend runs on 5774
```

### Frontend API Service - `services/db.tsx`
```typescript
const API_BASE_URL = "http://localhost:5774";  // Direct backend URL (when not using proxy)
// OR use relative URLs to let Vite proxy handle it
```

## Why Port 5173?

Port 5173 is **Vite's default port**. You don't need to configure it unless you want to change it. It's used because:

1. **Vite's Default**: When you run `vite` without specifying a port, it uses 5173
2. **No Conflicts**: It's unlikely to conflict with other common ports (3000, 8000, 8080, etc.)
3. **Standard Practice**: Most Vite projects use this port by default

## Can You Change Port 5173?

Yes! If you want to use a different port for the frontend, you can:

### Option 1: Configure in vite.config.ts
```typescript
server: {
  port: 3000,  // Change to your preferred port
  // ... rest of config
}
```

### Option 2: Use command line
```bash
npm run dev -- --port 3000
```

### Option 3: Set in package.json
```json
"dev": "vite --port 3000"
```

## Important Notes

1. **Google OAuth Configuration**: If you change the frontend port, update your Google OAuth settings:
   - Authorized JavaScript origins: `http://localhost:YOUR_PORT`
   - Authorized redirect URIs: `http://localhost:YOUR_PORT`

2. **API Proxy**: The Vite proxy automatically forwards `/api/*` requests to the backend (5774), so you don't need to change `API_BASE_URL` in `services/db.tsx` if using relative URLs.

3. **Production**: In production, both frontend and backend typically run on the same server, so only one port is needed.

## Current Setup

- **Frontend**: Port 5173 (Vite default)
- **Backend**: Port 5774 (custom)
- **Proxy**: Vite proxies `/api/*` from 5173 → 5774
- **API Base URL**: `http://localhost:5774` (direct connection, can also use relative URLs)

## Summary

- **5173** = Frontend (Vite) - This is normal and expected
- **5774** = Backend (Express) - Your API server
- The two ports work together via Vite's proxy configuration
- You can change 5173 if needed, but it's not necessary

