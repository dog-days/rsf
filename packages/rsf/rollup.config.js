import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

//babel需要再 commonjs plugin 之前配置
const commonjsPlugin = commonjs({
  include: /node_modules/,
});

function createCommonConfigByInput(input, fileName) {
  return [
    // CommonJS
    {
      input,
      output: {
        file: `lib/${fileName}.js`,
        format: 'cjs',
        indent: false,
        // 消除 bundle['default'] to access the default export
        exports: 'named',
      },
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'lodash/merge',
        'lodash/cloneDeep',
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
        'lodash/merge',
        'lodash/cloneDeep',
      ],
      plugins: [
        nodeResolve(),
        babel({ exclude: 'node_modules/**' }),
        commonjsPlugin,
      ],
    },
  ];
}

export default [...createCommonConfigByInput('src/index.js', 'rsf')];
