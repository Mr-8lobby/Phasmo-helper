import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project Pages repo: Mr-8lobby/Phasmo-helper
export default defineConfig({
  plugins: [react()],
  base: "/Phasmo-helper/", // case-sensitive; must match the repo name
});
