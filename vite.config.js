import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
import viteCompression from 'vite-plugin-compression';

const target = process.env.TARGET;

// clean up unused assets
function viteClean() {
  return {
    name: 'vite:clean',
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        // Only use this plugin during build
        if (!ctx || !ctx.bundle) return html;
        // Get the bundle
        Object.entries(ctx.bundle).forEach(
          (value) => delete ctx.bundle[value[0]],
        );
        return html;
      },
    },
  };
}

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
      output: {
        manualChunks: () => 'everything.js',
      },
    },
  },
  plugins: [
    svelte(),
    target === 'esp' && viteSingleFile(),
    target === 'esp' && viteCompression({ deleteOriginFile: true }),
    target === 'esp' && viteClean(),
  ],
});
