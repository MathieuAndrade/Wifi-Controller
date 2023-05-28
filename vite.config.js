import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
import viteCompression from 'vite-plugin-compression';

const target = process.env.TARGET;

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    brotliSize: false,
    outDir: target === 'esp' ? 'build/esp' : 'build/soft',
    rollupOptions: {
      inlineDynamicImports: true,
    },
  },
  plugins: [
    svelte(),
    target === 'esp' && viteSingleFile(),
    target === 'esp' && viteCompression({ deleteOriginFile: true }),
  ],
});
