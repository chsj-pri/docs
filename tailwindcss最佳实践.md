tailwindcss
    bradlc.vscode-tailwindcss

基础的设计原则
    主题颜色，字体大小、梯度、内外边距大小、梯度，常用的边框圆角大小、梯度，边框宽度、梯度
    边距单位一般按照4px的倍数来设置

颜色
    success，info，warning这种语义化的颜色，我们就可以基于这些来配置我们的颜色,包括但不限于字体、背景、边框、阴影颜色
        const colors = {
            'success': '#654321'，
            'info': '#123456',
            'warning': '#666666',
            // ...
        }
        module.exports = {
        content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
        theme: {
            // ...
            colors,
        },
        plugins: [],
        }

间距 & 宽高 & 行高 & 圆角 & 边框宽度
    tailwindcss默认长度相关的配置是基于rem
    PC端的项目大多数时候我们都是固定一个宽度，左右留白，元素的大小宽高边距单位都是px
    需要对默认的做一些特定配置来适配我们的项目:
    const spacing = {
    0: 0,
    4: '4px',
    8: '8px',
    12: '12px',
    // ... 项目中常用的都可以配置
    }
    module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        // v3 & v2
        spacing,
        lineHeight: spacing,
        borderWidth: spacing,
        borderRadius: spacing,
    },
    plugins: [],
    }
移动端适配方案
    viewport方案 flexable方案
    假设设计同学的设计稿都是750px的，我们就可以基于此来写两个函数方法来处理pxtorem和pxtovw的任务，如果你们是flexable方案就用pxToRem，如果是viewport的适配方案就用pxToVmin
```
    function pxToRem(variable) {
    return `${variable / 75}rem`
    }

    function pxToVmin(variable) {
    return `${variable / 7.5}vmin`
    }
    // flexable
    const fontSize = {
    12: pxToRem(12),
    14: pxToRem(14),
    16: pxToRem(16),
    ...
    }, spacing = {
    0: 0,
    4: pxToRem(4),
    8: pxToRem(8),
    12: pxToRem(12),
    ...
    }
    // viewport
    const fontSize = {
    12: pxToVmin(12),
    14: pxToVmin(14),
    16: pxToVmin(16),
    ...
    }, spacing = {
    0: 0,
    4: pxToVmin(4),
    8: pxToVmin(8),
    12: pxToVmin(12),
    ...
    }
    module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        // ...
        fontSize,
        spacing
    },
    plugins: [],
    }
```

嵌套语法
    插件叫@tailwindcss/nesting

固定行数后截断
    scss工具函数
    ```
        @mixin ellipsis($line: 1, $substract: 0) {
            @if $line==1 {
                white-space: nowrap;
                text-overflow: ellipsis;
            } @else {
                display: -webkit-box;
                -webkit-line-clamp: $line;
                -webkit-box-orient: vertical;
            }
            width: 100% - $substract;
            overflow: hidden;
        }
    ```

    专有的插件@tailwindcss/line-clamp

多主题
    tailwindcss中配合css var来实现多主题配色会简单到让你窒息：
    /* global base css */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    // 默认主题
    :root {
    --success: 5 193 174;
    --info: 51 163 238;
    --warning: 237 214 18;
    }
    // 主题1的配色
    .theme-1 {
    --success: 36 195 102;
    --info: 54 143 255;
    --warning: 234 209 27;
    }
    // 主题2的配色
    .theme-2 {
    --success: 57 209 121;
    --info: 0 186 255;
    --warning: 234 209 27;
    }

    tailwind.config.js中改变我们的颜色配置
    javascript复制代码// 让我们的颜色支持透明度设置
    function withOpacityValue(variable) {
    return ({ opacityValue }) => {
        return opacityValue === undefined
        ? `rgb(var(${variable}))`
        : `rgb(var(${variable}) / ${opacityValue})`
    }
    }

    const colors = {
    success: withOpacityValue('--success'),
    info: withOpacityValue('--info'),
    warning: withOpacityValue('--warning'),
    // ...
    }
    module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        // ...
        colors,
    },
    plugins: [require('@tailwindcss/line-clamp')],
    }

    <!-- 默认主题 -->
    <div>
    <!-- ... -->
    </div>
    <!-- 主题1 -->
    <div class="theme-1">
    <!-- ... -->
    </div>
    <!-- 主题2 -->
    <div class="theme-2">
    <!-- ... -->
    </div>

    如果某些元素样式特别复杂，导致html代码很长很乱怎么优化？你可以通过tailwindcss提供的@apply指令将一系列样式通过一个语义化的类表现出来
        <div class="complex-node">xxxx<div>

        // ...
        <style>
        .complex-node {
        @apply flex m-3 text-success rounded ....;
        }
        </style>

    我有一些样式是全局通用的，比如按钮，卡片的一些样式，我该怎么维护？你可以通过tailwindcss提供的@layer指令将比较通用的样式layer到components层，作为组件级别的样式，从而可以达到全局复用的目的
        @layer components {
            .btn-blue {
                @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
            }
        }

    我的项目是多人维护的，我如何保证原子化的样式类名称有一个比较合理的顺序呢？比如你喜欢先写宽高然后写定位，但是你的同事跟你相反，如何制定一个规范呢？tailwindcss提供了一个prettier插件prettier-plugin-tailwindcss，可以通过安装插件并且配置保存后更新即可规范不同成员写样式类的格式化问题






















