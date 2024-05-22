### 安装

```bash
npm install --save-dev @babel/core @babel/preset-env @babel/plugin-transform-runtime  @babel/preset-react @babel/plugin-proposal-decorators @babel/plugin-syntax-decorators rollup @rollup/plugin-babel @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-alias rollup-plugin-less rollup-plugin-terser rollup-plugin-node-polyfills @rollup/plugin-replace @rollup/plugin-url rollup-plugin-peer-deps-external rollup-plugin-postcss rollup-plugin-postcss-modules
```

## babelrc

```json
{
  "presets": [["@babel/preset-env", { "modules": false }]]
}
```

## rollup.config.js

```js
const babel = require("@rollup/plugin-babel");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const nodePolyfills = require("rollup-plugin-node-polyfills");
const replace = require("@rollup/plugin-replace");
const alias = require("@rollup/plugin-alias");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const less = require("rollup-plugin-less");
const postcss = require("rollup-plugin-postcss");
const url = require("@rollup/plugin-url");
const { terser } = require("rollup-plugin-terser");
const execute = require("rollup-plugin-shell");
const nodePath = require("path");

const production = !process.env.ROLLUP_WATCH;

module.exports = {
  input: "main.js",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "h5-form-editor",
  },
  plugins: [
    execute({ commands: ["npm version patch --force"], hook: "buildStart" }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    nodePolyfills(),
    resolve({
      browser: true,
      extensions: [".js", ".jsx", ".less", "css", ".json"],
    }),
    commonjs({
      include: /node_modules/,
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      babelrc: false,
      plugins: [
        ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
      ],
      presets: ["@babel/preset-env", "@babel/preset-react"],
    }),
    url({
      include: ["**/*.png", "**/*.jpg", "**/*.gif", "**/*.svg"],
    }),
    postcss({ plugins: [] }),
    peerDepsExternal({
      packageJsonPath: nodePath.resolve(__dirname, "package.json"),
    }),
    production && terser(),
  ],
};
```

## 打包

```bash
rollup --bundleConfigAsCjs
rollup -c packages/component-1/rollup.config.js

npm login
npm publish
lerna exec npm publish --scope=emoji-board
```
