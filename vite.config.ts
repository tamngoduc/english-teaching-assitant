import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  server: {
    port: 3000,
    host: true, // Allow external connections
    open: true,
  },

  // Build optimizations
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },

  preview: {
    port: 3001,
    open: true,
    // Enable SPA fallback for preview
    proxy: {
      // Fallback to index.html for non-API routes
      "^(?!/api).*": {
        target: "http://localhost:3001",
        rewrite: () => "/index.html",
      },
    },
  },
});
