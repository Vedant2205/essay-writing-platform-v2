import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Export Vite configuration
export default defineConfig({
  plugins: [react()], // Add React plugin for JSX support
  server: {
    port: 3000, // Development server port
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:5000', // Backend server URL
        changeOrigin: true, // Adjust the origin of the request
        secure: false, // Allow self-signed certificates for HTTPS (if needed)
      },
    },
  },
});
