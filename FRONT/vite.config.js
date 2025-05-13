import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // if the importer path contains @tabler/icons-react
          if (id.includes("@tabler/icons-react")) {
            return "vendor-icons";
          }
        },
      },
    },
  },
});
