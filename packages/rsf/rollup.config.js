// nodeResolve是必须的，要不watch模式会报错。
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
// import replace from 'rollup-plugin-replace';
// import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

//babel需要再 commonjs plugin 之前配置
const commonjsPlugin = commonjs({
  // include: /node_modules/,
  // include: [
  //   /node_modules\/prop-types/,
  //   /node_modules\/hoist-non-react-statics/,
  //   /node_modules\/invariant/,
  //   /node_modules\/react-is/,
  //   /node_modules\/warning/,
  // ],
  // namedExports: {
  //   'node_modules/react-js/index.js': ['isValidElementType'],
  // },
});

function createCommonConfigByInput(input, fileName, umdName) {
  return [
    // CommonJS
    {
      input,
      output: { file: `lib/${fileName}.js`, format: 'cjs', indent: false },
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ],
      plugins: [
        nodeResolve(),
        //babel需要再 commonjs plugin 之前配置
        babel({ exclude: 'node_modules/**' }),
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
      ],
      plugins: [
        nodeResolve(),
        babel({ exclude: 'node_modules/**' }),
        commonjsPlugin,
      ],
    },

    // // UMD Development
    // {
    //   input,
    //   output: {
    //     file: `dist/${fileName}.js`,
    //     format: 'umd',
    //     name: umdName,
    //     indent: false,
    //     sourcemap: false,
    //   },

    //   external: ['react', 'react-dom'],
    //   globals: {
    //     React: 'React',
    //     ReactDOM: 'ReactDOM',
    //   },
    //   plugins: [
    //     // replace({
    //     //   'process.env.NODE_ENV': JSON.stringify('development'),
    //     // }),
    //     babel({
    //       exclude: 'node_modules/**',
    //     }),
    //     nodeResolve({
    //       jsnext: true,
    //       main: true,
    //     }),
    //     commonjsPlugin,
    //   ],
    // },

    // // UMD Production
    // {
    //   input,
    //   output: {
    //     file: `dist/${fileName}.min.js`,
    //     format: 'umd',
    //     name: umdName,
    //     indent: false,
    //     sourcemap: false,
    //   },
    //   external: ['react', 'react-dom'],
    //   globals: {
    //     React: 'React',
    //     ReactDOM: 'ReactDOM',
    //   },
    //   plugins: [
    //     nodeResolve(),
    //     replace({
    //       'process.env.NODE_ENV': JSON.stringify('production'),
    //     }),
    //     babel({
    //       exclude: 'node_modules/**',
    //     }),
    //     commonjsPlugin,
    //     terser({
    //       compress: {
    //         pure_getters: true,
    //         unsafe: true,
    //         unsafe_comps: true,
    //         warnings: false,
    //       },
    //     }),
    //   ],
    // },
  ];
}

export default [...createCommonConfigByInput('src/index.js', 'rsf', 'Rsf')];
