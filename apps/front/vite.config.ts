import { fileURLToPath, URL } from "node:url";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    strictPort: false, // ポートが使用中の場合は次の利用可能なポートを使用
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      router: {
        routesDirectory: "apps/routes",
      },
    }),
    react(),
    ...(mode === "test" ? [] : [nitro()]),
  ],
}));
