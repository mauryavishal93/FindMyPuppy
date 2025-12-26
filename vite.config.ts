import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This is crucial: it exposes the system env variable API_KEY to your client-side code
      // as process.env.API_KEY to match your existing code structure.
      'process.env.API_KEY': JSON.stringify('AIzaSyCiZ3GoQx2S3QYkrCmtiN4SXBp5cKn7rUY'),
    },
    server: {
      host: true, // Listen on all network interfaces (0.0.0.0)
      allowedHosts: true, // Allow all hosts (fixes the Blocked Request error on Render)
    },
    preview: {
      host: true,
      allowedHosts: true,
    }
  }
})