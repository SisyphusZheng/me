import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

export default defineConfig({
  plugins: [tailwind()],
  static: true,
  build: {
    target: ["es2021", "chrome100", "safari13"],
    minify: true,
    outDir: "_site",
  },
  router: {
    trailingSlash: true,
    basePath: "",
  },
  server: {
    port: 8000,
    hostname: "0.0.0.0",
  },
  deploy: {
    entrypoint: "./main.ts",
    static: true,
  },
});
