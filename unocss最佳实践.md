https://unocss.dev/
https://alfred-skyblue.github.io/unocss-docs-cn/guide/
Unot

概念-原子化CSS
原子化 CSS 是一种 CSS 的架构方式，它倾向于小巧且用途单一的 class，并且会以视觉效果进行命名。

核心就是预置一大堆 class 样式，尽量将这些 class 样式简单化、单一化，在开发过程中，可以直接在 DOM 中写预置好的 class 名快速实现样式，而不需要每次写简单枯燥大量的 css 样式

原子化 CSS 是一种 CSS 的架构方法，倾向于使用用途单一且简单的 CSS，通常是根据视觉效果进行类的命名，不同于 BEM 规则的 CSS，原子的意思就是将 CSS 进行拆分，每个样式都有一个唯一的 CSS 规则

总的来说原子化 CSS 可以减少 CSS 的体积，同时提高 CSS 类的复用率，减少类名起名的复杂度；但是由于多种 CSS 样式堆积，可能会造成 class 名过长的缺点；同时增加记住 CSS 样式的记忆成本；

<button class="bg-blue-400 hover:bg-blue-500 text-sm text-white font-mono font-light py-2 px-4 rounded border-2 border-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600">

Tailwind
Windi
Tachyons
Antfu

npm add -D @unocss/preset-uno
.config.js
    import UnoCSS from 'unocss/vite'
    plugins: [
        UnoCSS({configFile: '../uno.config'}) 
    ]
uno.config.js
    import {
        defineConfig,
        presetAttributify,
        presetIcons,
        presetTypography,
        presetUno,
        presetWebFonts,
        transformerDirectives,
        transformerVariantGroup
    } from 'unocss'
    import presetUno from '@unocss/preset-uno'
    export default defineConfig({
    rules: [
            [/^mg-0.([\.\d]+)$/, ([_, num]) => ({ margin: `(${num}px)` })],
        ],
    shortcuts: [
    // ...
    ],
    theme: {
    colors: {
        // ...
    }
    },
    presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetWebFonts({
        fonts: {
        // ...
        }
    })// 使用自带的内部预设，按需引用
    ] 
    transformers: [transformerDirectives(), transformerVariantGroup()] })
自定义样式规则
    rules: [ [/^mg-0.([\.\d]+)$/, ([_, num]) => ({ margin: `(${num}px)` })], ],
图标:
    <!-- A basic anchor icon from Phosphor icons -->
    <div class="i-ph-anchor-simple-thin" />
普通模式：
    <div class="bg-blue-400 hover:bg-blue-500 text-sm text-white py-2 px-4 border-2 rounded border-blue-200">普通模式 </div>
属性模式:
    <div 
        bg="blue-400 hover:blue-500"
        text="sm white"
        font="mono light"
        p="y-2 x-4"
        border="2 rounded  blue-200"
        >


https://www.zhihu.com/question/588057410/answer/3075479109


Normalize.css

https://www.6hu.cc/archives/55142.html
https://antfu.me/posts/reimagine-atomic-css-zh




































