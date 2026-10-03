import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { execSync } from 'child_process';

export default defineConfig({
  base: './',
  plugins: [
    viteSingleFile(),
    {
      name: 'watch-svg-assets',
      configureServer(server) {
        server.watcher.add(['public/icons/**/*.svg', 'public/symbols/**/*.svg']);
        server.watcher.on('change', (file) => {
          if (file.includes('public/icons') || file.includes('public/symbols')) {
            console.log(`[svg-watcher] SVG modificado: ${file}, re-empaquetando símbolos e iconos...`);
            try {
              execSync('npx tsx scripts/bundle-symbols.ts', { stdio: 'inherit' });
              server.ws.send({ type: 'full-reload' });
            } catch (err) {
              console.error('[svg-watcher] Error al empaquetar:', err);
            }
          }
        });
      },
    },
  ],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    copyPublicDir: false,
  },
});
