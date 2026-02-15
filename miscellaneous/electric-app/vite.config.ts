import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import viteTsConfigPaths from "vite-tsconfig-paths"
import { caddyPlugin } from "./src/vite-plugin-caddy"

const config = defineConfig({
  ssr: { noExternal: [`zod`, `drizzle-orm`] },
  plugins: [
    devtools(),
    nitro(),
    viteTsConfigPaths({ projects: [`./tsconfig.json`] }),
    caddyPlugin(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
