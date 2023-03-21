import type { RollupOptions } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

const config: RollupOptions = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'es',
  },
  external: [
    'chalk',
    'cosmiconfig',
    'glob',
    'minimatch',
    'minimist',
    'ora',
    'tinify',
    'node:crypto',
    'node:fs',
    'node:https',
    'node:path',
  ],
  plugins: [commonjs(), typescript(), json()],
}

export default config
