import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import builtins from 'rollup-plugin-node-builtins';
import copy from 'rollup-plugin-copy';
import alias from '@rollup/plugin-alias';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import watchAssets from 'rollup-plugin-watch-assets';
import css from "rollup-plugin-import-css";
import { terser } from './rollup.terser.cjs';
import config from './convict.js';

const isLocal = config.get('buildEnvironment') === 'local';
const preactReplacement = 'preact/compat';

export default {
  input: {
    'lit-feature-flag': 'src/lit-feature-flag.ts',
    'preact-feature-flag': 'src/preact-feature-flag.ts',
    'preact-todo-list': 'src/preact-todo-list.ts',
  },
  output: {
    dir: 'dist',
    chunkFileNames: `[name].js`,
    entryFileNames: `[name].js`,
  },
  plugins: [
    copy({
      targets: [
        { src: 'src/index.html', dest: 'dist' },
        { src: 'src/lit.html', dest: 'dist' },
        { src: 'src/preact.html', dest: 'dist' },
        { src: 'src/styles.css', dest: 'dist' },
      ],
      verbose: true,
      copyOnce: false
    }),
    watchAssets({ assets: ['src/index.html', 'src/lit.html', 'src/preact.html', 'src/styles.css'] }),
    builtins(),
    nodeResolve({
      preferBuiltins: true,
    }),
    json(),
    commonJs(),
    nodePolyfills(),
    alias({
      entries: [
        { find: 'react', replacement: preactReplacement },
        { find: 'react-dom', replacement: preactReplacement },
      ],
    }),
    css(),
    typescript({ tsconfig: './tsconfig.json' }),
    !isLocal ? terser() : null,
  ],
};
