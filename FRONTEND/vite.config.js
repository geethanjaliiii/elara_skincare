// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create a chunk for react and react-dom
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          
          // Create a chunk for routing related packages
          if (id.includes('react-router') || id.includes('react-location')) {
            return 'routing'
          }

          // Create a chunk for authentication related code
          if (id.includes('@react-oauth') || id.includes('auth')) {
            return 'auth'
          }

          // Create a chunk for state management (Redux, etc)
          if (id.includes('redux') || id.includes('zustand')) {
            return 'state'
          }

          // Create a chunk for query management
          if (id.includes('@tanstack/react-query')) {
            return 'query'
          }

          // Group other node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        // Customize chunk filenames
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId || '';
          // Handle dynamic imports from pages/components
          if (facadeModuleId.includes('src/pages/')) {
            return 'pages/[name]-[hash].js';
          }
          if (facadeModuleId.includes('src/components/')) {
            return 'components/[name]-[hash].js';
          }
          return 'chunks/[name]-[hash].js';
        },
        // Configure asset file names
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Additional build optimizations
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    // Increase chunk size limit if needed
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@react-oauth/google'
    ],
  },
  // Dev server optimization
  server: {
    hmr: {
      overlay: false
    },
    watch: {
      usePolling: false,
      interval: 100
    }
  }
})