import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/cjs/jigsaw-puzzle.js',
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: 'dist/esm/jigsaw-puzzle.js',
      format: 'es',
    },
    {
      file: 'dist/min/jigsaw-puzzle.js',
      name: 'jigsawPuzzle',
      format: 'iife',
    },
  ],
  plugins: [terser()],
}
