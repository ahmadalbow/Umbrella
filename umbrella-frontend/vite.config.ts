// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  build: {
    outDir: '../dist', // Adjust this to match your build output directory
    rollupOptions: {
      input: '/main.tsx', // Adjust path if necessary
    },
  },
  server: {
    host: '192.168.178.96',
    port: 5555 // Replace with your desired IP address
  },
});