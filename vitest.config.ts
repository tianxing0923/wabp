import { defineConfig } from 'vitest/config'

const config = defineConfig({
  esbuild: {
    target: 'node14',
  },
})

export default config
