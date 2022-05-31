import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/jigsaw-puzzle.cjs.js',
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: 'dist/jigsaw-puzzle.esm.mjs',
      format: 'es',
    },
    {
      file: 'dist/jigsaw-puzzle.min.js',
      name: 'jigsawPuzzle',
      format: 'iife',
    },
  ],
  plugins: [terser()],
}
