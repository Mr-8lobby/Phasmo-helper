import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// If your repo is named "phasmo-helper", leave this as-is.
// If your repo is named something else, change it to `"/YOUR_REPO_NAME/"`
export default defineConfig({
  plugins: [react()],
  base: "/phasmo-helper/",
})
