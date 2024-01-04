


npm install --save-dev @babel/core @babel/preset-env rollup @rollup/plugin-babel @rollup/plugin-commonjs @rollup/plugin-node-resolve

// .babelrc
{
  "presets": [
    ["@babel/preset-env", { "modules": false }]
  ]
}


// rollup.config.js
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'YourPackageName',
  },
  plugins: [
    babel({
      babelHelpers: 'bundled', // 使用 'bundled' 以减小包的体积
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
  ],
};


rollup -c
rollup -c packages/component-1/rollup.config.js

npm login
npm publish