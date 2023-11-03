### 安装、启动
npx storybook@latest init
npm run storybook

### 介绍
```
import { Button } from "antd";

export default {
  component: Button,
};

export const Primary = {
  render: () => <Button type="primary">Primary Button</Button>,
};

export const PrimaryOther = {
  args: {
    type: "primary",
    children: "Primary Button"
  },
};
```
### 创建一个组件
```
export const Button = ({ primary, backgroundColor, size, label, ...props }) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";
  return (
    <button
      type="button"
      className={["storybook-button", `storybook-button--${size}`, mode].join(
        " "
      )}
      style={backgroundColor && { backgroundColor }}
      {...props}>
      {label}
    </button>
  );
};

```

### 创建组件故事
新建文件*.stories.js，如Button.stories.js

### 默认导出（Default export）
默认导出元数据控制Storybook如何展示故事，
component字段是必须的
```
import { Button } from './Button';
export default {
  component: Button,
};
```

### 定义故事
```
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  render: () => <Button primary label="Button" />,
};
```

### 使用React Hooks
```
import React, { useState } from 'react';

import { Button } from './Button';

export default {
  component: Button,
};

const ButtonWithHooks = () => {
  const [value, setValue] = useState('Secondary');
  const [isPrimary, setIsPrimary] = useState(false);

  const handleOnChange = () => {
    if (!isPrimary) {
      setIsPrimary(true);
      setValue('Primary');
    }
  };
  return <Button primary={isPrimary} onClick={handleOnChange} label={value} />;
};

export const Primary = {
  render: () => <ButtonWithHooks />,
};
```

### 重命名故事
```
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  name: 'I am the primary',
  render: () => <Button primary label="Button" />,
};
```

### 如何编写故事
一个故事是一个描述如何渲染组件的函数。可以为每个组件创建多个故事，最简单的方法是多次以不同参数渲染组件
```
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  render: () => <Button backgroundColor="#ff0" label="Button" />,
};

export const Secondary = {
  render: () => <Button backgroundColor="#ff0" label="😄👍😍💯" />,
};

export const Tertiary = {
  render: () => <Button backgroundColor="#ff0" label="📚📕📈🤓" />,
};
```

### 使用args
通过使用args来优化组件的故事，可以减少您需要为每个故事编写和维护的样板代码。
```
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    backgroundColor: '#ff0',
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

### 复用其他组件的args
```
import { ButtonGroup } from '../ButtonGroup';
import * as ButtonStories from './Button.stories';

export default {
  component: ButtonGroup,
};

export const Pair = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

### 使用play函数
storybook的play函数和@storybook/addon-interactions是便捷的辅助方法，用于测试需要用户干预的组件场景。
例如，假设您想要验证一个表单组件，您可以使用play函数编写以下故事，以检查在填写输入信息时组件的响应方式：

```
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { LoginForm } from './LoginForm';

export default {
  component: LoginForm,
};

export const EmptyForm = {};

export const FilledForm = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');
    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button'));

    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!'
      )
    ).toBeInTheDocument();
  },
};
```

### 使用参数（parameters）
配置Storybook插件的参数
例如配置backgrounds插件的参数
```
import { Button } from './Button';

export default {
  component: Button,
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
};
```

![Parameters background color](https://storybook.js.org/ec618271bee524c1a21af2b76482765e/parameters-background-colors.png)

### 使用装饰器（decorators）
如下示例，将对组件的每个故事填充3em的边距和红色背景
```
import { Button } from './Button';

export default {
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em', background: red }}>
        <Story />
      </div>
    ),
  ],
};
```

### 为两个或更多组件编写故事
在构建设计系统或组件库时，您可能会创建两个或更多组件以配合使用。例如，如果您有一个父级List组件，它可能需要子级的ListItem组件。
```

import React from 'react';
import { List } from './List';
import { ListItem } from './ListItem';

import { Selected, Unselected } from './ListItem.stories';

export default {
  component: List,
};

export const ManyItems = {
  render: (args) => (
    <List {...args}>
      <ListItem {...Selected.args} />
      <ListItem {...Unselected.args} />
      <ListItem {...Unselected.args} />
    </List>
  ),
};
```

### 故事args
args对象可以在故事、组件和全局级别定义
如下代码定义单个故事的参数

```
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const PrimaryLongName = {
  args: {
    ...Primary.args,
    label: 'Primary with a really long name',
  },
};
```

### 组件args
还可以在组件级别定义args；
将适用于组件的所有故事，除非覆盖它们
```
import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    primary: true,
  },
};
```

### 全局args
还可以在全局级别定义参数；
将适用于每个组件的故事，除非覆盖它们
```
// .storybook/preview.js

export default {
  args: { theme: 'light' },
};
```

### args组合
可以将故事的参数分开，然后在其他故事中组合使用
以下是如何将同一组件的多个故事的参数组合在一起的方法
```
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    primary: false,
  },
};
```

### args 可以修改组件的任何方面
可以在故事中使用 args 来配置组件的外观，类似于您在应用程序中所做的
例如，以下是如何使用 footer 参数来填充子组件的示例：
```
import { Page } from './Page';

export default {
  component: Page,
  render: ({ footer, ...args }) => (
    <Page {...args}>
      <footer>{footer}</footer>
    </Page>
  ),
};

export const CustomFooter = {
  args: {
    footer: 'Built with Storybook',
  },
};
```

### 在故事内部设置参数
```
import { useArgs } from '@storybook/preview-api';
import { Checkbox } from './checkbox';

export default {
  title: 'Inputs/Checkbox',
  component: Checkbox,
};

export const Example = {
  args: {
    isChecked: false,
    label: 'Try Me!',
  },

  render: function Render(args) {
    const [{ isChecked }, updateArgs] = useArgs();
    function onChange() {
      updateArgs({ isChecked: !isChecked });
    }
    return <Checkbox {...args} onChange={onChange} isChecked={isChecked} />;
  },
};
```

### 映射到复杂的参数值
复杂的值，比如JSX元素，不能被序列化到管理器（例如Controls插件）或与URL同步。参数值可以使用argTypes中的mapping属性从简单的字符串映射到复杂类型，以解决这个限制。它可以用于任何参数，但在使用选择控件类型时最有意义。
```
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    label: {
      options: ['Normal', 'Bold', 'Italic'],
      mapping: {
        Bold: <b>Bold</b>,
        Italic: <i>Italic</i>,
      },
    },
  },
};
```

故事parameters
```
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
};
```

组件parameters
```
import { Button } from './Button';

export default {
  component: Button,
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
};
```

全局parameters
```
// .storybook/preview.js

export default {
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
      ],
    },
  },
};
```

### parameters继承规则
全局、组件和故事参数的组合方式如下：
1. 更具体的参数优先（因此故事参数会覆盖组件参数，组件参数会覆盖全局参数）
2. 参数会合并，因此键只会被覆盖，不会被删除
3. 参数的合并很重要。这意味着可以在每个故事的基础上覆盖单个特定的子参数，但仍保留全局定义的大多数参数



### 使用额外的标签包装故事
装饰器用于对故事进行“包裹”
```
import { YourComponent } from './YourComponent';

export default {
  component: YourComponent,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

![Story with padding](https://storybook.js.org/68e08450f9dd9f5190ab21438833621d/decorators-padding.png)

### Context模拟
```
// .storybook/preview.js

import React from 'react';

import { ThemeProvider } from 'styled-components';

export default {
  decorators: [
    (Story) => (
      <ThemeProvider theme="default">
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

### 故事decorators
```
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

### 组件decorators
```
import { Button } from './Button';

export default {
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

### 全局decorators
```
// .storybook/preview.jsx

import React from 'react';

export default {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

### 装饰器decorators继承
与parameters一样，装饰器可以在全局级别、组件级别和单个故事级别进行定义
故事装饰器 > 组件装饰器 > 全局装饰器

### 使用Loader获取API数据
从远程API调用获得的响应被合并到故事函数的第二个参数——story上下文的loaded字段中。
```
import fetch from 'node-fetch';
import { TodoItem } from './TodoItem';

export default {
  component: TodoItem,
  render: (args, { loaded: { todo } }) => <TodoItem {...args} {...todo} />,
};

export const Primary = {
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

### 全局加载器Loader
```
// .storybook/preview.js

import fetch from 'node-fetch';

export default {
  loaders: [
    async () => ({
      currentUser: await (await fetch('https://jsonplaceholder.typicode.com/users/1')).json(),
    }),
  ],
};
```

### 加载器（Loader）继承
1. 与parameters一样，加载器可以在全局级别、组件级别和单个故事级别进行定义。
2. 所有适用于故事的所有级别的加载器都在故事在Storybook的画布中渲染之前运行。
3. 所有加载器并行运行
4. 所有结果都存储在故事上下文的loaded字段中
5. 如果存在重叠的键，"后来"的加载器优先级更高（从低到高）：
> 全局加载器，按定义的顺序
> 组件加载器，按定义的顺序
> 故事加载器，按定义的顺序




### 参考
https://storybook.js.org/docs/react/get-started/why-storybook









