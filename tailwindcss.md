### 语法规则

- 在Tailwind CSS中，冒号用于表示一种变体（variant

- 变体是在特定状态或上下文中应用不同样式的方式

- 例如，伪类（如`:hover`）、响应式设计断点（如`sm:`、`md:`）、状态（如`dark:`）等

##### 冒号前面的部分

*这部分通常表示一个变体，它可以是伪类、状态或者断点。例如：*

- `hover:` 表示鼠标悬停状态

- `sm:` 表示适用于小屏幕及以上的样式

- `focus:` 表示元素获得焦点时的样式

##### 冒号后面的部分

*表示具体的CSS类名。例如：*

- `hover:bg-blue-500` 表示在鼠标悬停时，背景色变为蓝色（`blue-500`）

- `sm:text-lg` 表示在小屏幕及以上，文字大小为`lg`

##### 可以组合多个变体

```html
sm:hover:text-red-500 /* 小屏幕及以上并且在鼠标悬停时文字颜色为红色 */
```

### 伪类/伪元素

- 在类名的开头添加一个修饰符
  `hover`  `focus`  `active`
  `visited`  `focus-within`  `focus-visible` 
  `first`  `last`
  `odd`  `even`
  `only-child`  `first-of-type`  `empty`
  `required`  `invalid`  `disabled`
  `read-only`  `indeterminate`  `checked` `placeholder`
  
  ```html
  <button class="bg-sky-500 hover:bg-sky-700 ...">
  Save changes
  </button>
  ```
  
  `before`  `after`
  
  ```html
  <label class="block">
  <span class="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
    Email
  </span>
  <input type="email" name="email" class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" placeholder="you@example.com" />
  </label>
  ```
  
  `file`
  
  ```html
  <form class="flex items-center space-x-6">
  <div class="shrink-0">
    <img class="h-16 w-16 object-cover rounded-full" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80" alt="Current profile photo" />
  </div>
  <label class="block">
    <span class="sr-only">Choose profile photo</span>
    <input type="file" class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "/>
  </label>
  </form>
  ```
  
  `marker`
  `selection`
  `first-line`  `first-letter`
  `backdrop`
  
  ```html
  <ul role="list" class="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
  </ul>
  ```

### 基于父状态的样式(group-{modifier})

  `group`  `group-*`
  `group-hover` `group-focus`  `group-active`   `group-odd`
  `group/{name}`  `group-hover/{name}` 嵌套组

- 用grou类标记父元素，并用group-*修饰符设置目标元素的样式

- 使用group/{name}类为该父组指定一个唯一的组名称，并使用group-hover/{name}类在修饰符中包含该名称

- 通过在方括号之间提供你自己的选择器作为[任意值]来即时创建一次性group-*修饰符

- 更多参考https://tailwind.nodejs.cn/docs/hover-focus-and-other-states#pseudo-class-reference*

- 使用 `&` 字符来标记 `.group` 在最终选择器中相对于你传入的选择器的位置
  
  ```html
  <a href="#" class="group block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-sky-500 hover:ring-sky-500">
  <div class="flex items-center space-x-3">
    <svg class="h-6 w-6 stroke-sky-500 group-hover:stroke-white" fill="none" viewBox="0 0 24 24"><!-- ... --></svg>
    <h3 class="text-slate-900 group-hover:text-white text-sm font-semibold">New project</h3>
  </div>
  <p class="text-slate-500 group-hover:text-white text-sm">Create a new project from a variety of starting templates.</p>
  </a>
  ```
  
  ```html
  <ul role="list">
  {#each people as person}
    <li class="group/item hover:bg-slate-100 ...">
      <img src="{person.imageUrl}" alt="" />
      <div>
        <a href="{person.url}">{person.name}</a>
        <p>{person.title}</p>
      </div>
      <a class="group/edit invisible hover:bg-slate-200 group-hover/item:visible ..." href="tel:{person.phone}">
        <span class="group-hover/edit:text-gray-700 ...">Call</span>
        <svg class="group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500 ...">
          <!-- ... -->
        </svg>
      </a>
    </li>
  {/each}
  </ul>
  ```
  
  ```html
  <div class="group is-published">
  <div class="hidden group-[.is-published]:block">
  Published
  </div>
  </div>
  ```
  
  ```html
  <div class="group">
  <div class="group-[:nth-of-type(3)_&]:block">
  <!-- ... -->
  </div>
  </div>
  ```

### 基于兄弟状态的样式(peer-{modifier})

  `peer`  `peer-*`
  `peer-invalid`  `peer-focus`  `peer-required`  `peer-disabled`
  `peer/{name}`  `peer-checked/{name}`

- 同级元素的状态设置

- 只能用于之前的兄弟姐妹

- 使用多个节点时，你可以通过使用 peer/{name} 类为该节点赋予唯一名称

- 通过在方括号之间提供你自己的选择器作为 任意值 来即时创建一次性 peer-* 修饰符

- 使用 & 字符来标记 .peer 在最终选择器中相对于你传入的选择器的位置
  
  ```html
  <form>
  <label class="block">
    <span class="block text-sm font-medium text-slate-700">Email</span>
    <input type="email" class="peer ..."/>
    <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
      Please provide a valid email address.
    </p>
  </label>
  </form>
  ```
  
  ```html
  <fieldset>
  <legend>Published status</legend>
  <input id="draft" class="peer/draft" type="radio" name="status" checked />
  <label for="draft" class="peer-checked/draft:text-sky-500">Draft</label>
  <input id="published" class="peer/published" type="radio" name="status" />
  <label for="published" class="peer-checked/published:text-sky-500">Published</label>
  <div class="hidden peer-checked/draft:block">Drafts are only visible to administrators.</div>
  <div class="hidden peer-checked/published:block">Your post will be publicly visible on your site.</div>
  </fieldset>
  ```
  
  ```html
  <form>
  <label for="email">Email:</label>
  <input id="email" name="email" type="email" class="is-dirty peer" required />
  <div class="peer-[.is-dirty]:peer-required:block hidden">This field is required.</div>
  <!-- ... -->
  </form>
  ```

### 直接子级的样式 (*-{modifier})

- 虽然通常最好将工具类直接放在子元素上，但在需要为你无法控制的直接子元素设置样式的情况下，可以使用 * 修饰符
  
  ```html
  <div>
  <h2>Categories<h2>
  <ul class="*:rounded-full *:border *:border-sky-100 *:bg-sky-50 *:px-2 *:py-0.5 dark:text-sky-300 dark:*:border-sky-500/15 dark:*:bg-sky-500/10 ...">
    <li>Sales</li>
    <li>Marketing</li>
    <li>SEO</li>
    <!-- ... -->
  </ul>
  </div>
  ```

### 基于后代的样式(has-{modifier})

  `has-[:focus]`   `has-[img]`  `has-[a]`

- 使用 has-* 修饰符根据其后代的状态或内容设置元素的样式
  
  ```html
  <label class="has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-900 has-[:checked]:ring-indigo-200 ..">
  <svg fill="currentColor">
    <!-- ... -->
  </svg>
  Google Pay
  <input type="radio" class="checked:border-indigo-500 ..." />
  </label>
  ```

### 基于群组后代的样式 (group-has-{modifier})

- 基于父元素的后代元素设置样式，可以使用 group 类标记父元素，并使用 group-has-* 修饰符设置目标元素的样式
  
  ```html
  <div class="group ...">
  <img src="..." />
  <h4>Spencer Sharp</h4>
  <svg class="hidden group-has-[a]:block ...">
    <!-- ... -->
  </svg>
  <p>Product Designer at <a href="...">planeteria.tech</a></p>
  </div>
  ```

### 基于对等后代的样式 (peer-has-{modifier})

- 基于同级元素的后代元素设置样式，可以使用 peer 类标记同级，并使用 peer-has-* 修饰符设置目标元素的样式
  
  ```html
  <fieldset>
  <legend>Today</legend>
  <div>
    <label class="peer ...">
      <input type="checkbox" name="todo[1]" checked />
      Create a to do list
    </label>
    <svg class="peer-has-[:checked]:hidden ...">
      <!-- ... -->
    </svg>
  </div>
  <!-- ... -->
  </fieldset>
  ```

### 响应式

##### 响应式断点

```html
<div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
  <!-- ... -->
</div>
```

sm    640px    @media (min-width: 640px) { ... }
md    768px    @media (min-width: 768px) { ... }
lg    1024px    @media (min-width: 1024px) { ... }
xl    1280px    @media (min-width: 1280px) { ... }
2xl    1536px    @media (min-width: 1536px) { ... }

max-sm    @media not all and (min-width: 640px) { ... }
max-md    @media not all and (min-width: 768px) { ... }
max-lg    @media not all and (min-width: 1024px) { ... }
max-xl    @media not all and (min-width: 1280px) { ... }
max-2xl   @media not all and (min-width: 1536px) { ... }

##### 自定义断点

```js
  /** @type {import('tailwindcss').Config} */
  module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  }
  }
```

##### 任意值

- 使用 min 或 max 修饰符使用任意值动态生成自定义断点
  
  ```html
  <div class="min-[320px]:text-center max-[600px]:bg-sky-300">
  <!-- ... -->
  </div>
  ```

##### 视口方向

```html
<div>
  <div class="portrait:hidden">
    <!-- ... -->
  </div>
  <div class="landscape:hidden">
    <p>
      This experience is designed to be viewed in landscape. Please rotate your
      device to view the site.
    </p>
  </div>
</div>
```

### 属性选择器

##### 数据属性

`data-*`

```html
<!-- Will apply -->
<div data-size="large" class="data-[size=large]:p-8">
  <!-- ... -->
</div>

<!-- Will not apply -->
<div data-size="medium" class="data-[size=large]:p-8">
  <!-- ... -->
</div>
```

### 自定义修饰符(任意变体)

- 任意变体只是表示选择器的格式字符串，封装在方括号中，& 表示正在修改的选择器
  
  ```html
  <ul role="list">
  {#each items as item}
  <li class="[&:nth-child(3)]:underline">{item}</li>
  {/each}
  </ul>
  ```

- 任意变体可以与内置修饰符叠加或相互叠加
  
  ```html
  <ul role="list">
  {#each items as item}
    <li class="lg:[&:nth-child(3)]:hover:underline">{item}</li>
  {/each}
  </ul>
  ```

- 如果选择器中需要空格，可以使用下划线
  
  ```html
  <div class="[&_p]:mt-4">
  <p>Lorem ipsum...</p>
  <ul>
    <li>
      <p>Lorem ipsum...</p>
    </li>
    <!-- ... -->
  </ul>
  </div>
  ```

- 创建插件
  
  ```js
  let plugin = require('tailwindcss/plugin')
  
  module.exports = {
    // ...
    plugins: [
      plugin(function ({ addVariant }) {
        // Add a `third` variant, ie. `third:pb-0`
        addVariant('third', '&:nth-child(3)')
      })
    ]
  }
  ```

### 重用样式

##### 多光标编辑

  `alt+click`

##### 使用 @apply 提取类

```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer components {
    .btn-primary {
      @apply py-2 px-5 bg-violet-500 text-white font-semibold rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75;
    }
  }
```

```html
    <!-- Before extracting a custom class -->
  <button class="py-2 px-5 bg-violet-500 text-white font-semibold rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75">
  Save changes
  </button>
  <!-- After extracting a custom class -->
  <button class="btn-primary">
  Save changes
  </button>
```

##### 避免过早抽象

- 在具有大量自定义 CSS 的项目中进行更改更糟糕
- 对所有内容都使用 @apply，那么你基本上只是再次编写 CSS，并放弃了 Tailwind 为你提供的所有工作流程和可维护性优势
- 使用 @apply，请将其用于非常小、高度可重用的事物，例如按钮和表单控件
- 组件化是更好的选择

### 自定义样式

##### 自定义主题

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'blue': '#1fb6ff',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  }
}
```

##### 任意值

- 使用方括号符号来动态生成一个具有任意值的类，基本上类似于内联样式，尽量避免

- 适用于框架中的所有内容，包括背景颜色、字体大小、伪元素内容等

- 使用 CSS 变量作为任意值时，不需要将变量封装在 `var(...)` 中 - 只需提供实际的变量名称

```html
<div class="top-[117px]">
  <!-- ... -->
</div>
```

```html
<div class="bg-[#bada55] text-[22px] before:content-['Festivus']">
  <!-- ... -->
</div>
```

```html
<div class="bg-[--my-color]">
  <!-- ... -->
</div>
```

##### 任意属性

- 使用 Tailwind 不包含的 CSS 属性时，可以使用方括号表示法来编写完全任意的CSS

- 可以使用CSS 变量

```html
<div class="[mask-type:luminance]">
  <!-- ... -->
</div>
```

```html
<div class="[mask-type:luminance] hover:[mask-type:alpha]">
  <!-- ... -->
</div>
```

```html
<div class="[--scroll-offset:56px] lg:[--scroll-offset:44px]">
  <!-- ... -->
</div>
```

##### 任意变体

```html
<ul role="list">
{#each items as item}
  <li class="lg:[&:nth-child(3)]:hover:underline">{item}</li>
{/each}
</ul>
```

##### 处理空格

- 当任意值需要包含空格时，使用下划线 (`_`)将在构建时自动将其转换为空格

- 在下划线很常见但空格无效的情况下，将保留下划线而不是将其转换为空格

- 使用反斜杠转义下划线，将不会转换为空格

```html
<div class="grid grid-cols-[1fr_500px_2fr]">
  <!-- ... -->
</div>
<div class="bg-[url('/what_a_rush.png')]">
  <!-- ... -->
</div>
<div class="before:content-['hello\_world']">
  <!-- ... -->
</div>
```

##### 添加样式

- 使用 @layer 指令可以控制最终的声明顺序，启用 [modifiers](https://tailwind.nodejs.cn/docs/adding-custom-styles#using-modifiers-with-custom-css) 和 [tree-shaking](https://tailwind.nodejs.cn/docs/adding-custom-styles#removing-unused-custom-css) 等功能

- 如果为特定的 HTML 元素添加默认基本样式，将样式添加到base层

- 添加到项目中的任何更复杂的类，将样式添加到components层，如 card、btn、badge 之类的类，components 层也是使用任何第三方组件放置自定义样式的好地方

- 将任何自定义工具类添加到utilities 层

- 添加到 `base`、`components` 或 `utilities` 层的任何自定义样式只有在实际使用时才会包含在编译的 CSS 中

- 如果添加一些应该始终包含的自定义 CSS，请将其添加到样式表中而不使用 `@layer` 指令

- 使用多个文件时，确保在使用 Tailwind 处理它们之前将这些文件合并到一个样式表中（使用 [postcss-import](https://github.com/postcss/postcss-import) 插件）

- `base` 层用于重置规则或应用于纯 HTML 元素的默认样式。

- `components` 层用于你希望能够使用工具覆盖的基于类的样式。

- `utilities` 层用于小型、单一用途的类，这些类应始终优先于任何其他样式。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
  /* ... */
}

@layer components {
  .card {
    background-color: theme('colors.white');
    border-radius: theme('borderRadius.lg');
    padding: theme('spacing.6');
    box-shadow: theme('boxShadow.xl');
  }
  /* ... */
}

@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
}

/* This will always be included in your compiled CSS */
.card {
  /* ... */
}
```

##### 编写插件

```js
const plugin = require('tailwindcss/plugin')

module.exports = {
  // ...
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({
        'h1': {
          fontSize: theme('fontSize.2xl'),
        },
        'h2': {
          fontSize: theme('fontSize.xl'),
        },
      })
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.xl'),
        }
      })
      addUtilities({
        '.content-auto': {
          contentVisibility: 'auto',
        }
      })
    })
  ]
}
```

### 指令

- 特定于 Tailwind 的 at-rules

##### @tailwind

- 将 Tailwind 的 base、components、utilities 和 variants 样式插入到 CSS 中

##### @layer

- 自定义样式属于哪个层，有效图层为 `base`、`components` 和 `utilities`

##### @apply

- 将任何现有工具类内联到自定义 CSS 中

- 一般用于覆盖第三方库中的样式

- 默认将删除 `!important`，以避免特殊性问题，如需保留将 `!important` 添加到声明的末尾

```html
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
.select2-search {
  @apply border border-gray-300 rounded;
}
.select2-results__group {
  @apply text-lg font-bold text-gray-900;
}
```

```html
/* Input */
.foo {
  color: blue !important;
}

.bar {
  @apply foo;
}

/* Output */
.foo {
  color: blue !important;
}

.bar {
  color: blue;
}

/* Input */
.btn {
  @apply font-bold py-2 px-4 rounded !important;
}

/* Output */
.btn {
  font-weight: 700 !important;
  padding-top: .5rem !important;
  padding-bottom: .5rem !important;
  padding-right: 1rem !important;
  padding-left: 1rem !important;
  border-radius: .25rem !important;
}
```

##### @config

- 指定在编译CSS文件时应使用哪个配置文件

```js
@config "./tailwind.site.config.js";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 函数

- 在 CSS 中使用这些函数来访问特定于 Tailwind 的值

- 函数在构建时进行计算，并在最终 CSS 中被静态值替换

##### theme()

- 通过点表示法访问配置值

- 访问包含点的值时使用方括号表示法

- 使用点表示法访问嵌套颜色值

- 调整检索到的颜色的透明度，使用斜杠后加透明度值

```css
.content-area {
  height: calc(100vh - theme(spacing.12));
}

.content-area {
  height: calc(100vh - theme(spacing[2.5]));
}

.btn-blue {
  background-color: theme(colors.blue.500);
}

.btn-blue {
  background-color: theme(colors.blue.500 / 75%);
}
```

##### screen()

- 引用断点的媒体查询

```css
/* Input */
@media screen(sm) {
  /* ... */
}

/* output */
@media (min-width: 640px) {
  /* ... */
}
```

### 定制化

##### 主题

```js
/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  corePlugins: {
    opacity: false,  // 禁用该插件
  }
  theme: {  // theme对象包含 screens、colors和spacing，其余为核心插件的键
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      gray: {
        100: '#f7fafc',
        900: '#1a202c',
      }
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
    },
    // Replaces all of the default `opacity` values
    opacity: {
      '0': '0',
      '20': '0.2',
      '40': '0.4',
      '60': '0.6',
      '80': '0.8',
      '100': '1',
    },
    borderRadius: {
      'none': '0',  // .rounded-none { border-radius: 0 }
      'sm': '.125rem',
      DEFAULT: '.25rem',  // .rounded { border-radius: .25rem } 创建没有后缀的类
      'lg': '.5rem',
      'full': '9999px',
    },
    backgroundSize: ({ theme }) => ({  // 引用另一个值
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
      ...theme('spacing')
    }),
    extend: {  // 扩展默认主题
      fontFamily: {
        display: 'Oswald, ui-serif', // Adds a new `font-display` class
        sans: [
          'Lato',
          ...defaultTheme.fontFamily.sans,  // 引用默认主题
        ]
      },
      screens: {
        '3xl': '1600px', // Adds a new `3xl:` screen variant
      }
    }
  }
}
```

##### 插件

```js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addUtilities, addComponents, e, config }) {
      // Add your custom styles here
    }),
  ]
}
```

- `addUtilities()`，用于注册新的静态工具样式

- `matchUtilities()`，用于注册新的动态工具样式

- `addComponents()`，用于注册新的静态组件样式

- `matchComponents()`，用于注册新的动态组件样式

- `addBase()`，用于注册新的基础样式

- `addVariant()`，用于注册自定义静态变体

- `matchVariant()`，用于注册自定义动态变体

- `theme()`，用于查找用户主题配置中的值

- `config()`，用于在用户的 Tailwind 配置中查找值

- `corePlugins()`，用于检查核心插件是否启用

- `e()`，用于手动转义用于类名的字符串

##### 预设

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@acmecorp/tailwind-base')
  ],
  // ...
}
```

```js
// Example preset
module.exports = {
  theme: {
    colors: {
      blue: {
        light: '#85d7ff',
        DEFAULT: '#1fb6ff',
        dark: '#009eeb',
      },
      pink: {
        light: '#ff7ce5',
        DEFAULT: '#ff49db',
        dark: '#ff16d1',
      },
      gray: {
        darkest: '#1f2d3d',
        dark: '#3c4858',
        DEFAULT: '#c0ccda',
        light: '#e0e6ed',
        lightest: '#f9fafc',
      }
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
    },
    extend: {
      flexGrow: {
        2: '2',
        3: '3',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### 插件

- Tailwind CSS IntelliSense

- Tailwind Documentation

- Tailwind Config Viewer

- Tailwind Fold

- Tailwind to CSS Snippets

- Gimli Tailwind

- Gridman

### 参考

- https://tailwind.nodejs.cn/docs/aspect-ratio
- https://zhuanlan.zhihu.com/p/471435680
- https://zhuanlan.zhihu.com/p/654134852
- https://zhuanlan.zhihu.com/p/672471628
- https://tailscan.com/colors
- https://www.tints.dev/
- https://javisperez.github.io/tailwindcolorshades/
- https://uicolors.app/create
- https://zhuanlan.zhihu.com/p/694048244
- https://zhuanlan.zhihu.com/p/587295688
