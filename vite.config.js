import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  const config = {
    plugins: [react()],
    server: {
      port: 3000,
    },
    // Define environment variables to be used in the app
    define: {
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:5000/api'),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:5000'),
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      // Ensure environment variables are handled during build
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  };

  // Add proxy configuration only during development
  if (command === 'serve') {
    config.server.proxy = {
      '/api': {
        // Use environment variable for target, fallback to localhost
        target: env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    };
  }

  return config;
});