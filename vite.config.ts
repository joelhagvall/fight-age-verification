import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  build: {
    chunkSizeWarningLimit: 600,
    sourcemap: true,
  },
  plugins: [
    tanstackStart({
      router: {
        codeSplittingOptions: {
          defaultBehavior: [['component']],
        },
      },
    }),
    tailwindcss(),
    nitro(),
    viteReact(),
  ],
})

export default config
