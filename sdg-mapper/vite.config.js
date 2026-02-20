import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // GitHub Pages serves from the /docs folder (configured in repo settings)
  build: {
    outDir: "docs",
  },

  // In local dev, proxy /api calls to a local Vercel dev server
  // Run `vercel dev` in a separate terminal on port 3001, or use `npx vercel dev`
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
