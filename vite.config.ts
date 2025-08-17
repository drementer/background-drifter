import { defineConfig } from 'vite';

export default defineConfig({
  // Specify the HTML entry point
  root: 'src',

  // Development server options
  server: {
    port: 3000,
    open: false, // Automatically open browser
    host: true, // Allow external connections
  },

  // Build options
  build: {
    outDir: '../dist', // Output relative to src directory
    sourcemap: false,
    // Generate manifest for asset tracking
    manifest: false,
    rollupOptions: {
      input: 'src/index.html',
      output: {
        // Clean asset naming
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  // Asset handling
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif', '**/*.webp'],

  // CSS options
  css: {
    devSourcemap: true,
  },
});
