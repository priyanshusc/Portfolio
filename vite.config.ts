import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Only the client folder is needed now
      allow: ["./client"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()], // Removed the expressPlugin()
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"), // Removed the @shared alias
    },
  },
});