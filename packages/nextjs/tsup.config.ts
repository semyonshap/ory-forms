import { defineConfig, type Options } from "tsup"

const baseExternal = [
  "next",
  "@ory/client-fetch",
  "@ory-forms/react",
  "cookie",
  "set-cookie-parser",
  "tldts",
  "lodash-es",
]

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
    external: [...baseExternal],
  },
])
