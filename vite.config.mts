import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // relative asset paths, as "homepage": "." did in Create React App
  base: './',
  plugins: [react()],
  server: { port: 3000 },
  build: { outDir: 'build' },
});
