> Yeoman 是一个现代化的脚手架工具，旨在帮助开发人员快速创建和搭建项目的基础结构

### 安装 yo 和生成器

```bash
npm i -g yo generator-webapp
```

> 生成器是以 generator-XYZ 命名的 npm 包

### 创建一个新项目

```bash
yo webapp
```

### 子生成器

> 通过 generator:sub-generator 访问

```bash
yo angular:controller MyNewController
```

### 其他 yo 命令

- yo --help：访问完整的帮助屏幕
- yo --generators：列出所有安装的生成器
- yo --version：获取版本
- yo doctor：故障排除

### 创建和分发 Yeoman 生成器

#### 设置为 Node 模块

- 使用 generator-generator 创建生成器
- package.json 文件
- name 属性必须以 generator- 为前缀
- keywords 属性必须包含 "yeoman-generator"
- npm install --save yeoman-generator
- files 属性必须是一个文件和目录的数组，由生成器使用

#### 文件夹树

```
├───package.json
└───generators/
    ├───app/
    │   └───index.js
    └───router/
        └───index.js
```

> 生成器将公开 yo name 和 yo name:router 命令

### 扩展生成器

```js
var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  // 名称 `constructor` 在这里很重要
  constructor(args, opts) {
    // 调用 super 构造函数很重要，以便我们的生成器被正确设置
    super(args, opts);

    // 接下来，添加您的自定义代码
    this.option("babel"); // 此方法添加对 `--babel` 标志的支持
  }

  method1() {
    this.log("method 1 just ran");
  }

  method2() {
    this.log("method 2 just ran");
  }
};
```

### 运行生成器

```bash
npm link
```

> 在生成器项目的根目录运行

### 私有方法

```js
class extends Generator {
  _private_method() {
    console.log('private hey');
  }
}
```

> 使用下划线前缀方法名称

### 运行优先级

可用的优先级包括（按运行顺序）：

- initializing - 初始化方法（检查当前项目状态、获取配置等）
- prompting - 提示用户选项的位置（您将调用 this.prompt() 的地方）
- configuring - 保存配置并配置项目（创建 .editorconfig 文件和其他元数据文件）
- default - 如果方法名不匹配任何优先级，则将其推送到此组
- writing - 编写生成器特定的文件（路由、控制器等）
- conflicts - 处理冲突的位置（在内部使用）
- install - 运行安装的位置（npm、bower）
- end - 最后调用，清理，告别等

### 异步任务

- 返回一个 Promise
- 调用 this.async()

```js
asyncTask() {
  var done = this.async();

  getUserEmail(function (err, name) {
    done(err);
  });
}
```

### 提示（Prompts）

```js
module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // 默认为当前文件夹名称
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?",
      },
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
  }
};
```

> 提示模块由 Inquirer.js 提供

### 在稍后阶段使用用户答案

```js
module.exports = class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?",
      },
    ]);
  }

  writing() {
    this.log("cool feature", this.answers.cool); // 使用用户答案 `cool`
  }
};
```

### 记住用户偏好

```js
this.prompt({
  type: "input",
  name: "username",
  message: "What's your GitHub username",
  store: true, // 记住用户先前的答案，并将该答案用作新的默认答案
});
```

### 参数（Arguments）

```bash
yo webapp my-project
```

```js
module.exports = class extends Generator {
  // 注意：参数和选项应该在构造函数中定义。
  constructor(args, opts) {
    super(args, opts);

    // 这使 `appname` 成为必需的参数。
    this.argument("appname", { type: String, required: true });
    /*
        desc - 参数的描述
        required - 它是否为必需的布尔值
        type - 字符串、数字或数组（还可以是接收原始字符串值并解析它的自定义函数）
        default - 默认值
        hide - 是否在帮助中隐藏的布尔值
    */

    // 然后您稍后可以访问它；例如
    this.log(this.options.appname);
  }
};
```

### 选项（Options）

```bash
yo webapp --coffee
```

```js
module.exports = class extends Generator {
  // 注意：参数和选项应该在构造函数中定义。
  constructor(args, opts) {
    super(args, opts);

    // 此方法添加对 `--coffee` 标志的支持
    this.option("coffee");

    // 然后您稍后可以访问它；例如
    this.scriptSuffix = this.options.coffee ? ".coffee" : ".js";
  }
};
```

### 输出信息

```js
module.exports = class extends Generator {
  myAction() {
    this.log("Something has gone wrong!");
  }
};
```

### 组合

```js
this.composeWith(generatorPath, options);
```

```js
this.composeWith(require.resolve("generator-bootstrap/generators/app"), {
  preprocessor: "sass",
});
```

### 与生成器类组合

```js
// 导入 generator-node 的主生成器
const NodeGenerator = require("generator-node/generators/app/index.js");

// 与其组合
this.composeWith({
  Generator: NodeGenerator,
  path: require.resolve("generator-node/generators/app"),
});
```

### 运行安装任务

```js
class extends Generator {
  installingLodash() {
    this.npmInstall(['lodash'], { 'save-dev': true });
  }
}
// 相当于: npm install lodash --save-dev
```

```js
class extends Generator {
  writing() {
    const pkgJson = {
      devDependencies: {
        eslint: '^3.15.0'
      },
      dependencies: {
        react: '^16.2.0'
      }
    };

    // 在目标路径中扩展或创建 package.json 文件
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();
  }
}
```

```js
generators.Base.extend({
  install: function () {
    this.installDependencies({
      npm: false,
      bower: true,
      yarn: true,
    });
  },
});

// 调用 this.installDependencies() 默认会运行 npm 和 bower
```

```js
class extends Generator {
  install() {
    this.spawnCommand('composer', ['install']);
  }
}
// 使用其他工具，如PHP的composer
```

### 目标上下文

将生成一个新应用程序的文件夹

```js
// 假设目标根目录是 ~/projects
class extends Generator {
  paths() {
    this.destinationRoot();
    // 返回 '~/projects'

    this.destinationPath('index.js');
    // 返回 '~/projects/index.js'
  }
}
```

> 使用 this.destinationRoot('new/path') 手动设置目标

### 模板上下文

模板上下文是存储模板文件的文件夹
默认为 ./templates/

```js
class extends Generator {
  paths() {
    this.sourceRoot();
    // 返回 './templates'

    this.templatePath('index.js');
    // 返回 './templates/index.js'
  }
}
```

> 使用 this.sourceRoot('new/template/path') 覆盖此默认值

### 文件工具

#### 示例：复制模板文件

```html
<html>
  <head>
    <title><%= title %></title>
  </head>
</html>
```

```js
class extends Generator {
  async prompting() {
    this.answers = await this.prompt([{
      type    : 'input',
      name    : 'title',
      message : 'Your project title',
    }]);
  }

  writing() {
    // copyTpl 使用 ejs 模板语法
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: this.answers.title } // 使用用户答案 `title`
    );
  }
}
```

### 通过流转换输出文件

```js
var beautify = require("gulp-beautify");
this.registerTransformStream(beautify({ indent_size: 2 }));
```

### 用户配置选项

```
this.config.save()
此方法将配置写入 .yo-rc.json 文件，每次设置配置选项时都会自动调用 save 方法，通常不需要显式调用它

this.config.set()
接受键和相关值，或多个键/值对的对象哈希

this.config.get()
接受一个字符串键作为参数，并返回关联的值

this.config.getAll()
返回完整可用配置的对象

this.config.delete()
删除一个键

this.config.defaults()
接受一个哈希选项作为默认值
如果键/值对已存在，则该值将保持不变
如果键丢失，它将被添加
```

# mem-fs-editor

### 用法

```javascript
import { create as createMemFs } from "mem-fs";
import { create as createEditor } from "mem-fs-editor";

const store = createMemFs();
const fs = createEditor(store);

fs.write("somefile.js", "var a = 1;");
await fs.commit();
```

### 读取文件

#### read(filepath, [options])

读取文件并以字符串形式返回其内容

- 如果传递 `options.raw = true`，则可以选择获取原始内容缓冲区
- 默认情况下，在文件路径不存在时调用 `read()` 会抛出错误
- 如果你愿意不处理 try/catch，你可以通过传递 `options.defaults = 'your default content'` 来获取默认内容

#### readJSON(filepath, [defaults])

读取文件并解析其内容为 JSON

- `readJSON()` 内部调用 `read()`，但如果传递的文件路径不存在，它不会抛出错误
  如果传递了可选的 `defaults`，在目标文件丢失时将返回默认内容，而不是 undefined（如果 JSON.parse 失败解析目标文件，仍然会抛出错误）

### 写入文件

#### write(filepath, contents)

- 使用字符串或缓冲区替换文件的内容（如果文件存在）或创建新文件

#### writeJSON(filepath, contents[, replacer [, space]])

- 使用将通过调用 `JSON.stringify()` 转换的对象替换文件的内容（如果文件存在）或创建新文件
- `contents` 通常应该是 JSON 对象，但从技术上讲，可以是任何可以由 `JSON.stringify` 接受的内容
- 可以选择作为最后两个参数传递 `replacer` 和 `space`，如 `JSON.stringify` 中定义的那样
- `space` 用于格式化输出字符串（美化）
- `space` 的默认值为 2，如果未指定

### 追加到文件

#### append(filepath, contents, [options])

将新内容追加到当前文件内容

- `options.trimEnd`（默认为 true）：修剪当前文件内容的尾随空格
- `options.separator`（默认为 `os.EOL`）：在当前内容和新内容之间插入的分隔符
- `options.create`（默认为 false）：如果文件不存在，则创建文件

#### appendTpl(filepath, contents, context[, templateOptions[, [options]])

将新内容追加到现有文件路径内容，并将新内容解析为 ejs 模板，其中 `context` 是模板上下文（模板内可用的变量名）

- `options.trimEnd`（默认为 true）：修剪当前文件内容的尾随空格
- `options.separator`（默认为 `os.EOL`）：在当前内容和新内容之间插入的分隔符

### 扩展 JSON 文件内容

#### extendJSON(filepath, contents[, replacer [, space]])

使用作为参数提供的部分对象扩展现有 JSON 文件的内容

可以选择使用与 `#writeJSON()` 相同的 JSON 格式化参数

### 删除文件或目录

#### delete(filepath, [options])

删除文件或目录

- `filePath` 也可以是 glob
- 如果 `filePath` 是 glob，则可以选择传递 `options.globOptions` 对象以更改其模式匹配行为
- 在 `globOptions` 中强制将 `sync` 标志设置为 true

### 复制文件

#### copy(from, to, [options], context[, templateOptions])

从 `from` 路径复制文件（或文件）到 `to` 路径

- 当传递数组时，应该传递 `options.fromBasePath` 以用于计算相对路径 `to`
- 否则，将检测并使用常见目录作为 `fromBasePath`
- 可以选择传递一个 `options.process` 函数（`process(contents)`），返回一个将成为新文件内容的字符串或缓冲区
- `process` 函数将使用一个参数 `contents`，即作为缓冲区的复制文件内容
- `options.ignoreNoMatch`：可以用于消除如果没有文件匹配 `from` 模式则抛出的错误
- `options.append`：当文件已经加载到 mem-fs 中时，可以用于将 `from` 内容附加到 `to` 而不是复制（对于再生是安全的）
- 如果 `from` 是与文件系统匹配的 glob 模式，则 `to` 必须是输出目录。对于 glob 化的 `from`，可以选择传递一个 `options.globOptions` 对象以更改其模式匹配行为。在 `globOptions` 中强制将 `nodir` 标志设置为 true，以确保将每个匹配目录表示为在 mem-fs 存储中标记为删除的 vinyl 对象

### 异步复制

#### copyAsync(from, to, [options], context[, templateOptions])

`copy` 的异步版本

- `copy` 将 `from` 加载到内存中并将其内容复制到 `to`
- `copyAsync` 直接从磁盘复制到 `to`，如果磁盘上不存在文件，则回退到 `copy` 行为
- 参数与 `copy` 相同

### 复制并解析为模板

#### copyTpl(from, to, context[, templateOptions [, copyOptions]])

复制 `from` 文件，并且如果它不是二进制文件，则将其内容解析为 ejs 模板，其中 `context` 是模板上下文（模板内可用的变量名）

- 可以选择传递一个 `templateOptions` 对象，`mem-fs-editor` 会自动设置 `filename` 选项，因此您可以轻松使用部分
- 还可以选择传递一个 `copyOptions` 对象（有关更多详细信息，请参阅 `copy()` 文档）

模板语法如下：

```ejs
<%= value %>
<%- include('partial.ejs', { name: 'Simon' }) %>
```

目录语法如下：

```ejs
/some/path/dir<%= value %>/...
```

### 异步复制并解析为模板

#### copyTplAsync(from, to, [options], context[, templateOptions])

`copyTpl` 的异步版本，使用 `copyAsync` 而不是 `copy`

- 可用于获得最佳性能。减少了开销
- 参数与 `copyTpl` 相同

### 移动文件

#### move(from, to, [options])

将文件从 `from` 路径移动/重命名到 `to` 路径

- `move` 内部使用 `copy` 和 `delete`，因此 `from` 可以是 glob 模式，并且可以提供 `options.globOptions`

### 检查文件是否存在

#### exists(filepath)

如果文件存在，则返回 true，如果找不到或已删除文件，则返回 false

### 提交更改

#### commit([options,] [...transforms])

将存储的文件通过管道传递，并将对文件所做的每个更改持久保存到 mem-fs 存储器中的磁盘

- 如果提供了 `options`，则是管道选项。默认情况下，只有修改过的文件会通过管道传递。通过传递自定义过滤器 `options.filter` 来自定义通过管道传递的文件。如果提供了 `...transforms`，则是应用于 vinyl 文件流的 TransformStream 的可变参数（类似于 gulp 插件）。`commitTransform` 附加到 `transforms` 并将修改过的文件持久保存到磁盘，未修改的文件会被传递。

- 返回解析一旦管道完成

### 转储文件

#### dump([cwd,] [filter])

转储文件以比较预期结果，为相对路径提供 `cwd`，允许省略临时路径，提供 `filter` 函数或模式以便专注于特定文件

- 如果未提供 `filter` 或模式，则 `dump` 仅返回已修改（已提交或未提交）的文件

### 参考

```
this.fs.copyTpl(this.templatePath('test/**/*'), this.destinationPath('test'), {answers: this.answers});
this.fs.copyTpl(this.templatePath('gitignore'), this.destinationPath('.gitignore'), {answers: this.answers});
  this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {answers: this.answers});

{
    "name": "<%= answers['app:name'] %>",
}
```
