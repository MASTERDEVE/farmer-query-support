import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cache-Control': 'no-store', // disables caching
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
