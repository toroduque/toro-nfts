import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// In production we serve from a GitHub Pages project subpath
// (https://toroduque.github.io/toro-nfts/); in dev we serve from root.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/toro-nfts/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
}));
