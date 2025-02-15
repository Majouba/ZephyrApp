import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true, // Permet d'utiliser les SVG comme des icônes
      },
    }),
  ],
  server: {
    strictPort: true,      // Empêche Vite de changer de port si le 5173 est occupé
    watch: {
      usePolling: true,    // Active le polling pour surveiller les changements de fichiers
    },
    open: true,            // Ouvre automatiquement l'application dans le navigateur
  },
});
