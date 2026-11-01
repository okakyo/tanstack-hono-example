import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "src/index": "src/index.ts",
    "src/client": "src/client.ts",
    "src/schema": "src/schema.ts",
  },
  format: ["esm"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  dts: {
    resolve: false,
    compilerOptions: {
      composite: false,
    },
  },
  platform: "node",
  target: "node20",
});
