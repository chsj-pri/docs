> SVGR 将 SVG 文件导入并生成 React 组件

## 安装

```bash
npm install --save-dev @svgr/webpack
```

## 使用

**webpack.config.js**

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
};
```

**你的代码**

```javascript
import Star from "./star.svg";

const Example = () => (
  <div>
    <Star />
  </div>
);
```

## 选项

使用配置文件（如 `svgr.config.js`）或直接在 webpack 配置中指定选项：

**webpack.config.js**

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [{ loader: "@svgr/webpack", options: { icon: true } }],
      },
    ],
  },
};
```

## 在同一项目中使用 SVGR 和 SVG 资源

您可能希望将一些 SVG 用作资源（url），将其他 SVG 用作 React 组件

最简单的方法是为其中一种类型使用 resourceQuery

**webpack.config.js**

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        type: "asset",
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // 排除React组件如果 *.svg?url
        use: ["@svgr/webpack"],
      },
    ],
  },
};
```

**你的代码**

```javascript
import svg from "./assets/file.svg?url";
import Svg from "./assets/file.svg";

const App = () => {
  return (
    <div>
      <img src={svg} width="200" height="200" />
      <Svg width="200" height="200" viewBox="0 0 3500 3500" />
    </div>
  );
};
```

## 在 CSS 文件中使用 SVG

选项 `issuer: /\.[jt]sx?$/` 确保只有在从 JavaScript 或 TypeScript 文件中导入 SVG 时，SVGR 才会应用

这使您可以在您的 .css 或 .scss 中安全地导入 SVG，而不会出现任何问题

```css
.example {
  background-image: url(./assets/file.svg);
}
```

## 与 url-loader 或 file-loader 一起使用

url-loader 和 file-loader 在 webpack v5 中已弃用

强烈建议使用前面描述的 resourceQuery 方法

SVGR 可以与 url-loader 或 file-loader 一起使用

**webpack.config.js**

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack", "url-loader"],
      },
    ],
  },
};
```

**你的代码**

```javascript
import starUrl, { ReactComponent as Star } from "./star.svg";

const App = () => (
  <div>
    <img src={starUrl} alt="star" />
    <Star />
  </div>
);
```

默认情况下，命名导出默认为 `ReactComponent`，并且可以使用 `namedExport` 选项进行自定义

@svgr/webpack 将尝试通过默认导出 React 组件，如果没有其他处理 svg 文件的加载器使用默认导出，@svgr/webpack 将始终通过命名导出 React 组件

如果在任何情况下更喜欢命名导出，可以将 `exportType` 选项设置为 `named`

## 使用自己的 Babel 配置

默认情况下，@svgr/webpack 包含了一个带有优化配置的 babel-loader

在某些情况下，您可能希望应用自定义配置（例如，如果您使用 Preact）

您可以通过在选项中指定 `babel: false` 来关闭 Babel 转换

```javascript
// 使用Preact的例子
{
  test: /\.svg$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: ['preact', 'env'],
      },
    },
    {
      loader: '@svgr/webpack',
      options: { babel: false },
    }
  ],
}
```
