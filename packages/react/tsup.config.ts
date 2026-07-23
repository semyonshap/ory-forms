import { defineConfig, type Options } from "tsup"

const baseConfig: Options = {
  dts: true,
  minify: false,
  sourcemap: true,
  bundle: true,
  format: ["cjs", "esm"],
}

export default defineConfig([
  {
    ...baseConfig,
    entry: ["src/index.ts"],
    outDir: "dist/",
    treeshake: true,
    external: [
      "react",
      "react-dom",
      "@ory/client-fetch",
      "react-hook-form",
      "react-i18next",
      "i18next",
      "zustand",
      "lodash",
    ],
  },
])
