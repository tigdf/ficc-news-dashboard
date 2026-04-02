import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // In dev, proxy /data requests to the parent data/ directory
  server: {
    fs: {
      allow: ['..'],
    },
  },
  // In production (Vercel), the digest JSON is served as a static asset
  // Vercel will serve files from the 'public' folder — we copy latest.json there at build time
});
