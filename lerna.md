### 安装

```bash
npm i lerna -g
```

### 两种模式

- Independent 模式 配合 Git，检查文件变动，只发布有改动的包
- Fixed/Locked 模式 默认，每次发布 packges 都是全量发布

### 初始化

```bash
lerna init
lerna init --independent
```

### lerna.json

```js
{
  "version": "1.1.3",
  "npmClient": "npm",
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file", "*.md"],
      "message": "chore(release): publish",
      "registry": "https://npm.pkg.github.com"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}
```

- version：当前版本
- npmClient：指定运行命令的客户端，设定为"yarn"则使用 yarn 运行，默认值是"npm"
- command.publish.ignoreChanges：通配符的数组，其中的值不会被 lerna 监测更改和发布，使用它可以防止因更改发布不必要的新版本
- command.publish.message：执行发布版本更新时的自定义提交消息
- command.publish.registry：使用它来设置要发布的自定义注册 url，而非 http://npmjs.org
- command.bootstrap.ignore：运行 lerna bootstrap 指令时会忽视该字符串数组中的通配符匹配的文件
- command.bootstrap.npmClientArgs：该字符串数组中的参数将在 lerna bootstrap 命令期间直接传递给 npm install
- command.bootstrap.scope：该通配符的数组会在 lerna bootstrap 命令运行时限制影响的范围
- packages ：表示包位置的全局变量数组

### 命令

- lerna init
- lerna create：此命令的作用是用来创建一个子包名为 xx 的项目
- lerna add：此命令用于安装依赖，格式为 lerna add [@version] [--dev]
- lerna list：查看当前包名列表
- lerna link：将所有相互依赖的包符号链接在一起
- lerna exec：在每个包中执行任意命令
- lerna run：在每个包中运行 npm 脚本如果该包中存在该脚本。

### 新建模块

```bash
lerna create module-a
lerna create module-b
```

### 安装依赖

```bash
lerna add module-b --scope=module-a
```

```js
// module-a
// module-a中引入module-b
const moduleB = require('module-b');
console.log('moduleB:', moduleB());

function moduleA() {
    return 'it's module a';
}
module.exports = moduleA;
```

```js
// module-b
function moduleB() {
    return 'it's module b';
}
module.exports = moduleB;
```

### 发布

```
统一加上@m_alfred前缀:
@m_alfred/module-a
@m_alfred/module-b
```

```bash
lerna publish
```

### 共用 devDependencies

```bash
# 将各个包package.json中共同的devDependencies移动到根目录的package.json中
lerna link convert
```
