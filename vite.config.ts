import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

// Emulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // serve index.html from spa/ directory
  root: __dirname,                              // your SPA folder :contentReference[oaicite:1]{index=1}
  publicDir: false,                             // no separate public/ dir :contentReference[oaicite:2]{index=2}

  plugins: [react()],

  server: {
    host: true,                                 // bind 0.0.0.0 so Nginx can proxy :contentReference[oaicite:3]{index=3}
    port: 5173,
    strictPort: true,
    allowedHosts: ['test.tandabuionline.ac.tz'],// whitelist your domain :contentReference[oaicite:4]{index=4}
    cors: true,
    hmr: { clientPort: 5173, protocol: 'ws' }    // HMR settings :contentReference[oaicite:5]{index=5}
  },

  preview: {
    host: true,
    allowedHosts: ['test.tandabuionline.ac.tz']
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: false,                        // single CSS file :contentReference[oaicite:6]{index=6}
    // remove manualChunks/inlineDynamicImports entirely
    rollupOptions: {
      // leave blank or customize per Vite defaults :contentReference[oaicite:7]{index=7}
      output: { }
    }
  }
});
