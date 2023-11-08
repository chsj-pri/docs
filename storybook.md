### 安装、启动
npx storybook@latest init
npm run storybook

### 介绍
```jsx
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
```jsx
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
```jsx
import { Button } from './Button';
export default {
  component: Button,
};
```

### 定义故事
```jsx
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  render: () => <Button primary label="Button" />,
};
```

### 使用React Hooks
```jsx
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
```jsx
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
```jsx
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
```jsx
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
```jsx
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

```jsx
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
```jsx
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


### 使用装饰器（decorators）
如下示例，将对组件的每个故事填充3em的边距和红色背景
```jsx
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
```jsx

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

```jsx
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
```jsx
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
```jsx
// .storybook/preview.js

export default {
  args: { theme: 'light' },
};
```

### args组合
可以将故事的参数分开，然后在其他故事中组合使用
以下是如何将同一组件的多个故事的参数组合在一起的方法
```jsx
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
```jsx
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
```jsx
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
```jsx
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
```jsx
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
```jsx
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
```jsx
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
```jsx
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

### Context模拟
```jsx
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
```jsx
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
```jsx
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
```jsx
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
```jsx
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
```jsx
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

### 组件命名
```jsx
import { Button } from './Button';
export default {
  title: 'Button', // 命名，可选的
  component: Button,
};
```

### 组件分组
```jsx
import { Button } from './Button';
export default {
  title: 'Design System/Atoms/Button', // 分组
  component: Button,
};
```

###  构建页面
**纯呈现页面**
**容器页面**

##### 使用参数组合的纯呈现页面
```jsx
// YourPage.js|jsx
import React from 'react';
import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';
export function DocumentScreen({ user, document, subdocuments }) {
  return (
    <PageLayout user={user}>
      <DocumentHeader document={document} />
      <DocumentList documents={subdocuments} />
    </PageLayout>
  );
}
```
```jsx
// YourPage.stories.js|jsx
import { DocumentScreen } from './YourPage';
import * as PageLayout from './PageLayout.stories';
import * as DocumentHeader from './DocumentHeader.stories';
import * as DocumentList from './DocumentList.stories';
export default {
  component: DocumentScreen,
};

export const Simple = {
  args: {
    user: PageLayout.Simple.args.user,
    document: DocumentHeader.Simple.args.document,
    subdocuments: DocumentList.Simple.args.documents,
  },
};
```

##### 使用MSW模拟API请求的容器页面
```shell
// 安装
pnpm add --save-dev msw msw-storybook-addon
// 初始化
npx msw init public/
```
```jsx
// .storybook/preview.js
import { initialize, mswDecorator } from 'msw-storybook-addon';
initialize();

export default {
  decorators: [mswDecorator], // 添加MSW修饰器
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
```
```jsx
// .storybook/main.js
export default {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public'], // 配置静态文件夹
};
```
```jsx
// YourPage.js|jsx|mjs|ts|tsx
import React, { useState, useEffect } from 'react';
import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

function useFetchData() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);
  useEffect(() => {
    setStatus('loading');
    fetch('https://your-restful-endpoint')
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setStatus('success');
        setData(data);
      })
      .catch(() => {
        setStatus('error');
      });
  }, []);
  return {
    status,
    data,
  };
}
export function DocumentScreen() {
  const { status, data } = useFetchData();
  const { user, document, subdocuments } = data;
  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  if (status === 'error') {
    return <p>There was an error fetching the data!</p>;
  }
  return (
    <PageLayout user={user}>
      <DocumentHeader document={document} />
      <DocumentList documents={subdocuments} />
    </PageLayout>
  );
}
```
```jsx
// YourPage.stories.js|jsx
import { rest } from 'msw';
import { DocumentScreen } from './YourPage';

export default {
  component: DocumentScreen,
};

const TestData = {
  user: {
    userID: 1,
    name: 'Someone',
  },
  document: {
    id: 1,
    userID: 1,
    title: 'Something',
    brief: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'approved',
  },
  subdocuments: [
    {
      id: 1,
      userID: 1,
      title: 'Something',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'approved',
    },
  ],
};

export const MockedSuccess = {
  parameters: {
    msw: [
      rest.get('https://your-restful-endpoint/', (_req, res, ctx) => {
        return res(ctx.json(TestData));
      }),
    ],
  },
};

export const MockedError = {
  parameters: {
    msw: [
      rest.get('https://your-restful-endpoint', (_req, res, ctx) => {
        return res(ctx.delay(800), ctx.status(403));
      }),
    ],
  },
};
```

### 使用 children 作为参数
```jsx
import { List } from './List';
import { Unchecked } from './ListItem.stories';
export default {
  title: 'List',
  component: List,
};

export const OneItem = {
  args: {
    children: <Unchecked {...Unchecked.args} />,
  },
};
```

### 创建模板组件
```jsx
import { List } from './List';
import { ListItem } from './ListItem';
import { Unchecked } from './ListItem.stories';

export default {
  title: 'List',
  component: List,
};

const ListTemplate = {
  render: ({ items, ...args }) => {
    return (
      <List>
        {items.map((item) => (
          <ListItem {...item} />
        ))}
      </List>
    );
  },
};

export const Empty = {
  ...ListTemplate,
  args: {
    items: [],
  },
};

export const OneItem = {
  ...ListTemplate,
  args: {
    items: [
      {
        ...Unchecked.args,
      },
    ],
  },
};
```

### 设置自动生成的文档
```jsx
// Button.stories.js
import { Button } from './Button';
export default {
  component: Button,
  tags: ['autodocs'], // 启用自动生成文档
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

### 配置文档页面
```jsx
// .storybook/main.js
export default {
  addons: ['@storybook/addon-essentials'],
  // 配置文档页面
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
};
```

### 编写自定义文档模板
```jsx
// .storybook/preview.jsx
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';

export default {
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
};
```

### 使用MDX
```markdown
{/* DocumentationTemplate.mdx */}
import { Meta, Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';
<Meta isTemplate />
<Title />
# Default implementation
<Primary />
## Inputs
The component accepts the following inputs (props):
<Controls />
---
## Additional variations
Listed below are additional variations of the component.
<Stories />
```
```jsx
// .storybook/preview.jsx
import DocumentationTemplate from './DocumentationTemplate.mdx';
export default {
  parameters: {
    docs: {
      page: DocumentationTemplate,
    },
  },
};
```

### 发布Storybook
```shell
npm run build-storybook
npx http-server ./path/to/build
```

### action（配置argType）
```jsx
// Button.stories.js|jsx
import { Button } from './Button';
export default {
  component: Button,
  argTypes: { onClick: { action: 'clicked' } }, // 事件将显示在action面板中
};
```

### action（自动匹配args）
```jsx
// .storybook/preview.js
export default {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
};
```
```jsx
// Button.stories.js|jsx

import { Button } from './Button';
export default {
  component: Button,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};
```

### action（HTML事件处理器）
```jsx
// Button.stories.js|jsx

import { Button } from './Button';
import { withActions } from '@storybook/addon-actions/decorator';
export default {
  component: Button,
  parameters: {
    actions: {
      handles: ['mouseover', 'click .btn'], // 格式为<eventname <selector> 选择器是可选的，默认为所有元素
    },
  },
  decorators: [withActions],
};
```

### 选择控件类型
```jsx
import { Button } from './Button';
export default {
  component: Button,
  argTypes: {
    type: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
};

export const Primary = {
  args: {
    type: 'primary',
  },
};
```

### 自定义控件类型匹配器
```jsx
// .storybook/preview.js
export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
```

### 导入CSS文件
```jsx
// .storybook/preview.js
import '../src/styles/global.css';
export default {
  parameters: {},
};
```

### 参考
https://storybook.js.org/docs/react/get-started/why-storybook
https://storybook.js.org/docs/react/api/arg-types

| Data Type   | Control        | Description                                                  |
| :---------- | :------------- | :----------------------------------------------------------- |
| **boolean** | `boolean`      | Provides a toggle for switching between possible states. `argTypes: { active: { control: 'boolean' }}` |
| **number**  | `number`       | Provides a numeric input to include the range of all possible values. `argTypes: { even: { control: { type: 'number', min:1, max:30, step: 2 } }}` |
|             | `range`        | Provides a range slider component to include all possible values. `argTypes: { odd: { control: { type: 'range', min: 1, max: 30, step: 3 } }}` |
| **object**  | `object`       | Provides a JSON-based editor component to handle the object's values. Also allows edition in raw mode. `argTypes: { user: { control: 'object' }}` |
| **array**   | `object`       | Provides a JSON-based editor component to handle the values of the array. Also allows edition in raw mode. `argTypes: { odd: { control: 'object' }}` |
|             | `file`         | Provides a file input component that returns an array of URLs. Can be further customized to accept specific file types. `argTypes: { avatar: { control: { type: 'file', accept: '.png' } }}` |
| **enum**    | `radio`        | Provides a set of radio buttons based on the available options. `argTypes: { contact: { control: 'radio', options: ['email', 'phone', 'mail'] }}` |
|             | `inline-radio` | Provides a set of inlined radio buttons based on the available options. `argTypes: { contact: { control: 'inline-radio', options: ['email', 'phone', 'mail'] }}` |
|             | `check`        | Provides a set of checkbox components for selecting multiple options. `argTypes: { contact: { control: 'check', options: ['email', 'phone', 'mail'] }}` |
|             | `inline-check` | Provides a set of inlined checkbox components for selecting multiple options. `argTypes: { contact: { control: 'inline-check', options: ['email', 'phone', 'mail'] }}` |
|             | `select`       | Provides a drop-down list component to handle single value selection. `argTypes: { age: { control: 'select', options: [20, 30, 40, 50] }}` |
|             | `multi-select` | Provides a drop-down list that allows multiple selected values. `argTypes: { countries: { control: 'multi-select', options: ['USA', 'Canada', 'Mexico'] }}` |
| **string**  | `text`         | Provides a freeform text input. `argTypes: { label: { control: 'text' }}` |
|             | `color`        | Provides a color picker component to handle color values. Can be additionally configured to include a set of color presets. `argTypes: { color: { control: { type: 'color', presetColors: ['red', 'green']} }}` |
|             | `date`         | Provides a datepicker component to handle date selection. `argTypes: { startDate: { control: 'date' }}` |







