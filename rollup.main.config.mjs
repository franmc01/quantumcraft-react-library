import postcss from 'rollup-plugin-postcss';
import { createConfig, plugins } from './rollup.base.config.mjs';

export default createConfig(
  'src/index.ts',
  [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins.concat([
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
  ])
);
