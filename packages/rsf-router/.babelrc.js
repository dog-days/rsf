const { NODE_ENV } = process.env;

module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/env',
      {
        targets: {
          browsers: ['ie >= 9'],
        },
        exclude: ['transform-async-to-generator', 'transform-regenerator'],
        //test需要把import转换成commonjs require模式
        //rollup 支持 es import
        modules: NODE_ENV === 'TEST' ? 'commonjs' : false,
        loose: true,
      },
    ],
  ],
  plugins: [
    'dev-expression',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
};
