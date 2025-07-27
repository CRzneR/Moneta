import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist", // <-- ensure build output goes to dist/
    chunkSizeWarningLimit: 1000, // (optional) increase warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"], // (optional) split vendor code
        },
      },
    },
  },
});
