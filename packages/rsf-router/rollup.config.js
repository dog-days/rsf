//nodeResolve是必须的，要不watch模式会报错。
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

//babel需要再 commonjs plugin 之前配置
const commonjsPlugin = commonjs();

function createCommonConfigByInput(input, fileName, umdName) {
  return [
    // CommonJS
    {
      input,
      output: { file: `lib/${fileName}.js`, format: 'cjs', indent: false },
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'history/createBrowserHistory',
        'history/createHashHistory',
        'history/createMemoryHistory',
      ],
      plugins: [
        //babel需要再 commonjs plugin 之前配置
        babel({ exclude: 'node_modules/**' }),
        nodeResolve({
          jsnext: true,
        }),
        commonjsPlugin,
      ],
    },

    // ES
    {
      input,
      output: { file: `es/${fileName}.js`, format: 'es', indent: false },
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'history/createBrowserHistory',
        'history/createHashHistory',
        'history/createMemoryHistory',
      ],
      plugins: [
        babel({ exclude: 'node_modules/**' }),
        nodeResolve({
          jsnext: true,
        }),
        commonjsPlugin,
      ],
    },

    // UMD Development
    {
      input,
      output: {
        file: `dist/${fileName}.js`,
        format: 'umd',
        name: umdName,
        indent: false,
        sourcemap: false,
      },
      external: ['react', 'react-dom', 'prop-types'],
      globals: {
        React: 'React',
        ReactDOM: 'ReactDOM',
        PropTypes: 'PropTypes',
      },
      plugins: [
        babel({
          exclude: 'node_modules/**',
        }),
        nodeResolve({
          jsnext: true,
        }),
        commonjsPlugin,
        replace({
          'process.env.NODE_ENV': JSON.stringify('development'),
        }),
      ],
    },

    // UMD Production
    {
      input,
      output: {
        file: `dist/${fileName}.min.js`,
        format: 'umd',
        name: umdName,
        indent: false,
        sourcemap: false,
      },
      external: ['react', 'react-dom', 'prop-types'],
      globals: {
        React: 'React',
        ReactDOM: 'ReactDOM',
        PropTypes: 'PropTypes',
      },
      plugins: [
        babel({
          exclude: 'node_modules/**',
        }),
        nodeResolve({
          jsnext: true,
        }),
        commonjsPlugin,
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        terser({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
          },
        }),
      ],
    },
  ];
}

export default [
  ...createCommonConfigByInput('src/index.js', 'rsf-router', 'RsfRouter'),
  ...createCommonConfigByInput('src/Router.js', 'router', 'Router'),
  ...createCommonConfigByInput(
    'src/BrowserRouter.js',
    'browser-router',
    'BrowserRouter'
  ),
  ...createCommonConfigByInput(
    'src/HashRouter.js',
    'hash-router',
    'HashRouter'
  ),
  ...createCommonConfigByInput(
    'src/MemoryRouter.js',
    'memory-router',
    'MemoryRouter'
  ),
  ...createCommonConfigByInput(
    'src/PathToRegexpMatchPath.js',
    'path-to-regexp-match-path',
    'PathToRegexpMatchPath'
  ),
];
