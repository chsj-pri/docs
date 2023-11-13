### 安装及使用
- 安装

  ```jsx
  npm install -g @tarojs/cli
  ```

- Taro命令及创建项目

  ```jsx
  taro init myApp		//创建模板项目
  taro info		//环境及依赖检测
  taro doctor		//诊断项目是否存在问题
  Taro create --name 页面名称		//快速创建新页面并填充基础代码
  taro config --help		//查看config命令用法
  ```

- 微信小程序编译

  ```jsx
  npm run dev:weapp
  npm run build:weapp
  ```

  *打开微信开发者工具，然后选择项目根目录进行预览
  注意事项：
  设置关闭 ES6 转 ES5 功能，开启可能报错
  设置关闭上传代码时样式自动补全，开启可能报错
  设置关闭代码压缩上传，开启可能报错*

- H5编译

  ```jsx
  npm run dev:h5
  npm run build:h5
  ```

### 目录结构
├── dist                        编译结果目录
|
├── config                      项目编译配置目录
|   ├── index.js                默认配置
|   ├── dev.js                  开发环境配置
|   └── prod.js                 生产环境配置
|
├── src                         源码目录
|   ├── pages                   页面文件目录
|   |   └── index               index 页面目录
|   |       ├── index.js        index 页面逻辑
|   |       ├── index.css       index 页面样式
|   |       └── index.config.js index 页面配置
|   |
|   ├── app.js                  项目入口文件
|   ├── app.css                 项目总通用样式
|   └── app.config.js           项目入口配置
|
├── project.config.json         微信小程序项目配置 project.config.json
├── project.tt.json             字节跳动小程序项目配置 project.tt.json
├── project.swan.json           百度小程序项目配置 project.swan.json
├── project.qq.json             QQ 小程序项目配置 project.qq.json
|
├── babel.config.js             Babel 配置
├── tsconfig.json               TypeScript 配置
├── .eslintrc                   ESLint 配置
|
└── package.json

### 配置
- 编译配置
*config 目录(index.js、dev.js、prod.js)*

- 设计稿及尺寸单位
*config/index.js 中的 designWidth 配置*

- 全局配置
*app.config.js*

*1. 通用配置项:*

|属性						|类型							|必填		|描述|
|---------------|----------------|------|---|
|[pages](https://taro-docs.jd.com/taro/docs/app-config#pages)					|String Array		|是			|页面路径列表|
|[window](https://taro-docs.jd.com/taro/docs/app-config#window)					|Object					|否			|全局的默认窗口表现|
|[tabBar](https://taro-docs.jd.com/taro/docs/app-config#tabbar)			  	|Object					|否			|底部 tab 栏的表现|
|[subPackages](https://taro-docs.jd.com/taro/docs/app-config#subpackages)   |Object Array		|否			|分包结构配置|

*2. 小程序端特有属性*

|属性	|类型	|描述|
|--------|--------|-----|
|[networkTimeout](https://taro-docs.jd.com/taro/docs/app-config#networktimeout)	|Object	|网络超时时间|
|debug	|Boolean	|是否开启 debug 模式，默认关闭|
|permission	|Object	|小程序接口权限相关设置|
|requiredBackgroundModes	|String Array	|需要在后台使用的能力，如「音乐播放」|
|preloadRule	|Object	|分包预下载规则|
|entryPagePath	|String	|小程序默认启动首页|
|workers	|String	|Worker 代码放置的目录|
|navigateToMiniProgramAppIdList	|String Array	|需要跳转的小程序列表|

*3. 微信小程序特有属性*

|属性	|类型	|描述|
|--------|--------|------|
|[functionalPages](https://taro-docs.jd.com/taro/docs/app-config#functionalpages)	|Boolean	|是否启用插件功能页，默认关闭|
|plugins	|Object	|使用到的插件|
|resizable	|Boolean	|iPad 小程序是否支持屏幕旋转，默认关闭|
|usingComponents	|Object	|全局自定义组件配置|
|sitemapLocation	|String	|指明 sitemap.json 的位置|
|style	|String	|指定使用升级后的weui样式|
|useExtendedLib	|Object	|指定需要引用的扩展库|
|entranceDeclare	|Object	|微信消息用小程序打开|
|darkmode	|boolean	|小程序支持 DarkMode|
|themeLocation	|String	|指明 theme.json 的位置|
|lazyCodeLoading	|String	|配置自定义组件代码按需注入|
|singlePage	|Object	|单页模式相关配置|

*4. H5 端支持的属性*
|属性	|类型	|必填	|默认值	|描述	|最低版本|
|--------|--------|--------|-------------|---------|-------------|
|[entryPagePath](https://taro-docs.jd.com/taro/docs/app-config#entrypagepath)	|String	|否	|	|默认启动首页	|3.3.17|
|appId	|String	|否	|"app"	|渲染页面的容器 id	|3.3.18|
|animation	|RouterAnimate、boolean	|否	|{ "duration": 300, "delay": 50 }	|是否开启 h5 端路由动画功能，默认开启	3.3.18||

- 页面配置
  *page.config.js
  页面中的配置项会覆盖全局配置的window中相同的配置项
  可以在页面 JS中使用definePageConfig宏函数定义页面配置，代替 page.config.js文件
  多端差异化逻辑可以使用 process.env.TARO_ENV 变量作条件判断来实现*

  *[配置项](https://taro-docs.jd.com/taro/docs/page-config):*

  ```jsx
  navigationBarBackgroundColor
  navigationBarTextStyle
  navigationBarTitleText
  navigationStyle
  transparentTitle
  backgroundColor
  backgroundTextStyle
  backgroundColorTop
  backgroundColorBottom
  enablePullDownRefresh
  onReachBottomDistance
  pageOrientation
  disableScroll
  disableSwipeBack
  usingComponents
  ```

- 项目配置
*微信小程序: [project.config.json](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html?search-key=%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE)*

- [Babel配置](https://taro-docs.jd.com/taro/docs/babel-config)
*babel.config.js*

### React
- React API

  ```jsx
  import React, {Component, useState, useEffect} from 'react'
  ```

- [入口组件](https://taro-docs.jd.com/taro/docs/react-entry)
  *用来注册应用，可以设置全局状态或访问小程序入口实例的生命周期，默认目录src/app.js*
  *生命周期方法: 入口组件除支持React生命周期方法外，还额外支持以下生命周期*
    1. onLaunch(options)  //启动
    2. componentDidShow(options)  //程序启动，或切前台时触发
    3. componentDidHide()  //程序切后台时触发
    4. onPageNotFound(Object)  //打开的页面不存在时触发

  ```jsx
  import React, { Component } from 'react'
  import './app.css'
  
  class App extends Component {
    render () {
      // this.props.children 是将要会渲染的页面
      return this.props.children
    }
  }
  
  // 每一个入口组件都必须导出一个 React 组件
  export default App
  ```

- [页面组件](https://taro-docs.jd.com/taro/docs/react-page)
  *生命周期方法: 入口组件除支持React生命周期方法外，还额外支持以下生命周期*

    1. [onLoad](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page-life-cycle.html)(options)
    2. onUnload()
    3. onReady()  //只页面组件才会触发
    4. componentDidShow()  //页面显示/切入前台时触发，只页面组件才会触发
    5. componentDidHide()  //页面隐藏/切入后台时触发，只页面组件才会触发
    6. onPullDownRefresh()  //监听用户下拉动作
    7. onReachBottom()  //监听用户上拉触底事件
    8. onPageScroll({scrollTop})  //监听用户滑动页面事件
    9. onResize(Object)  //屏幕旋转时触发，详见[响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81)
    10. onTabItemTap({index, pagePath, text})  //点击tab时触发
    11. onAddToFavorites({imageUrl?})  //监听收藏事件，并返回内容{title,imageUrl,query}
    12. onShareAppMessage({from, target, webViewUrl?})  //监听转发事件，并返回内容{title, path, imageUrl}
    13. onShareTimeline()  ////监听分享到朋友圈事件，并返回内容{title, query, imageUrl}
  ```jsx
  import { View } from '@tarojs/components'
  class Index extends Component {
    state = {
      msg: 'Hello World!'
    }
  
    onReady () {
      console.log('onReady')
    }
  
    render () {
      return <View>{ this.state.msg }</View>
    }
  }
  
  export default Index
  ```

- [内置组件](https://taro-docs.jd.com/taro/docs/components-desc)

  ```jsx
  //引入内置组件
  import { Swiper, SwiperItem } from '@tarojs/components'
  
  function Index () {
  	return (
      <Swiper className='box' onClick={e => {}}> /*调用e.stopPropagation可以阻止冒泡*/
        <SwiperItem>
          <View className='text'>1</View>
        </SwiperItem>
      </Swiper>
  	)
  }
  ```

- Ref
  *使用React Ref获取到的是Taro的虚拟DOM，和浏览器的DOM相似，可以操作它的style，调用它的API等；
  但是Taro的虚拟DOM运行在小程序的逻辑层，并不是真实的小程序渲染层节点，它没有尺寸宽高等信息。*

  ```jsx
  import React, { createRef } from 'react'
  import { View } from '@tarojs/components'
  
  export default class Test extends React.Component {
    el = createRef()
  
    componentDidMount () {
      // 获取到的 DOM 具有类似 HTMLElement 或 Text 等对象的 API
      console.log(this.el.current)
    }
  
    render () {
      return (
        <View id='only' ref={this.el} />
      )
    }
  }
  ```

  ```jsx
  //获取小程序 DOM
  //获取真实的小程序渲染层节点，需要在onReady生命周期中，调用小程序中用于获取 DOM 的 API
  import React from 'react'
  import { View } from '@tarojs/components'
  import Taro from '@tarojs/taro'
  
  export default class Test extends React.Component {
    onReady () {
      // onReady 触发后才能获取小程序渲染层的节点
      Taro.createSelectorQuery().select('#only')
        .boundingClientRect()
        .exec(res => console.log(res))
    }
  
    render () {
      return (
        <View id='only' />
      )
    }
  }
  ```

- Hooks
  [React Hooks](https://zh-hans.reactjs.org/docs/hooks-reference.html)
  [Taro Hooks](https://taro-docs.jd.com/taro/docs/hooks)
  1. useRouter  等同于Class Component的getCurrentInstance().router
  ```const router = useRouter()```
  2. useReady  等同于页面的onReady生命周期钩子
  3. useDidShow
  4. useDidHide
  5. usePullDownRefresh
  6. useReachBottom
  7. usePageScroll
  8. useResize
  9. useShareAppMessage
  10. useTabItemTap
  11. useAddToFavorites
  12. useShareTimeline

- dangerouslySetInnerHTML
  *通过React的dangerouslySetInnerHTML直接[渲染HTML](https://taro-docs.jd.com/taro/docs/html/)*

  ```jsx
  function HelloWorld() {
    const html = `<h1 style="color: red">Wallace is way taller than other reporters.</h1>`
    return <View dangerouslySetInnerHTML={{ __html: html }}></View>
  }
  ```

- Minified React error
  *Taro构建小程序时默认使用production版本的React相关依赖，因此当遇到类似报错：Minified React error时，可修改编译配置的mini.debugReact选项，重新编译后Taro会使用development版本的React，从而输出报错堆栈*

### 路由功能
- 路由跳转
  Taro.switchTab(option)  //跳转到tabBar页面，并关闭其他所有非tabBar页面
  Taro.reLaunch(option)  //关闭所有页面，打开到应用内的某个页面
  Taro.redirectTo(option)  //关闭当前页，跳转某个页面，不允许跳转到tabbar页面
  Taro.navigateTo(option)  //保留当前页，跳转到某个页面，不能跳到tabbar页面
  Taro.navigateBack(option)  //关闭当前页面，返回上一页面或多级页面

- 路由传参
  通过在url后面添加查询字符串参数进行跳转传参
  ```jsx
  // 传入参数 id=2&type=test
  Taro.navigateTo({
    url: '/pages/page/path/name?id=2&type=test'
  })
  ```

- 获取路由参数
  通过 Taro.getCurrentInstance().router.params 获取路由参数
  
  ```jsx
  componentDidMount () {
    // 获取路由参数
    console.log(this.$instance.router.params)
  }
  ```

### 跨平台开发
- 内置环境变量
  *process.env.TARO_ENV 取值：weapp / swan / alipay / tt / qq / jd / h5 / rn*
  **在编译阶段，会移除不属于当前编译类型的代码，只保留当前编译类型下的代码**

  ```jsx
  //在微信小程序和 H5 端分别引用不同资源
  if (process.env.TARO_ENV === 'weapp') {
    require('path/to/weapp/name')
  } else if (process.env.TARO_ENV === 'h5') {
    require('path/to/h5/name')
  }
  ```

  ```jsx
  //不同端要加载的组件
  <View>
    {process.env.TARO_ENV === 'weapp' && <ScrollViewWeapp />}
    {process.env.TARO_ENV === 'h5' && <ScrollViewH5 />}
  </View>
  ```

- 多端文件
  ├── test.js                Test 组件默认的形式，编译到微信小程序、百度小程序和 H5 之外的端使用的版本
  ├── test.weapp.js          Test 组件的微信小程序版本
  ├── test.swan.js           Test 组件的百度小程序版本
  └── test.h5.js             Test 组件的 H5 版本

  ```jsx
  import Test from '../../components/test'
  <Test argA={1} argA={2} />
  ```

### jQuery-like API
- 安装
  npm i @tarojs/extend

- 引入
  import { $ } from '@tarojs/extend'

- 核心方法
  1. $() *通过执行CSS选择器，包装DOM节点*
  ```jsx
  $('view')  //页面中所有p元素
  $('#foo')  //ID为foo的元素
  $('.bar')  //class为foo的元素
  $("<text>Hello</text>") //新的text元素
  $("<text />", { text:"Hello", id:"greeting", css:{color:'darkblue'} }) // 创建带有属性的元素
  ```
  2. $.fn *是一个对象，拥有jQuery对象上所有可用的方法，如addClass、attr*
  ```jsx
  //添加一个empty方法，在jQuery对象上都能用到该方法
  $.fn.empty = function(){
  	return this.each(function(){ this.innerHTML = '' })
  }
  ```
  3. addClass *为每个匹配的元素添加指定的class类名,多个使用空格分隔*
  4. after *在每个匹配的元素后插入内容，内容可以字符串，dom节点，节点组成的数组*
  5. append *在每个匹配的元素末尾插入内容*
  6. attr *读取或设置属性*
  7. before *在匹配每个元素的前面插入内容*
  8. children *获得每个匹配元素集合元素的直接子元素*
  9. clone *通过深度克隆来复制集合中的所有元素*
  10. closest *从元素本身开始，逐级向上级元素匹配，并返回最先匹配selector的元素*
  ```jsx
  var input = $('input[type=text]')
  input.closest('form')
  ```
  11. contents *获得每个匹配元素集合元素的子元素，包括文字和注释节点*
  12. css *读取或设置css属性*
  ```jsx
  var elem = $('h1')
  elem.css('background-color')
  elem.css('background-color', '#369')
  elem.css({ backgroundColor: '#8EE', fontSize: 28 })
  ```
  13. data *读取或写入ddata-属性*
  14. each *遍历一个对象集合每个元素*
  15. empty *清空对象集合中每个元素的DOM内容*
  16. eq *从当前对象集合中获取给定索引值（0为基数）的元素*
  17. filter *过滤对象集合，返回对象集合中满足css选择器的项*
  18. find *在当对象前集合内查找符合CSS选择器的每个元素的后代元素*
  19. first *获取当前对象集合中的第一个元素*
  20. forEach *遍历对象集合中每个元素*
  21. get *从当前对象集合中获取所有元素或单个元素*
  22. has *判断当前对象集合的子元素是否有符合选择器的元素*
  23. hasClass *检查对象集合中是否有元素含有指定的class*
  24. height *获取对象集合中第一个元素的高度；或者设置对象集合中所有元素的高度*
  25. hide *通过设置css的属性 display 为 none 来将对象集合中的元素隐藏*
  26. html *获取或设置对象集合中元素的HTML内容*
  27. index *获取一个元素的索引值*
  28. insertAfter *将集合中的元素插入到指定的目标元素后面*
  29. insertBefore *将集合中的元素插入到指定的目标元素前面*
  30. last *获取对象集合中最后一个元素*
  31. map *遍历对象集合中的所有元素*
  32. next *获取对象集合中每一个元素的下一个兄弟节点*
  33. not *过滤当前对象集合，获取一个新的对象集合，它里面的元素不能匹配css选择器*
  34. offset *获得当前元素相对于document的位置*
  35. offsetParent *找到第一个定位过的祖先元素*
  36. parent *获取对象集合中每个元素的直接父元素*
  37. parents *获取对象集合每个元素所有的祖先元素*
  38. position *获取对象集合中第一个元素的位置*
  39. prepend *将参数内容插入到每个匹配元素的前面*
  40. prependTo *将所有元素插入到目标前面*
  41. prev *获取对象集合中每一个元素的前一个兄弟节点，通过选择器来进行过滤*
  42. prop *读取或设置dom元素的属性值*
  43. remove *从其父节点中删除当前集合中的元素，有效的从dom中移除*
  44. removeAttr *移除当前对象集合中所有元素的指定属性*
  45. removeClass *移除当前对象集合中所有元素的指定class*
  46. removeProp *从集合的每个DOM节点中删除一个属性*
  47. replaceWith *用给定的内容替换所有匹配的元素*
  48. scrollLeft *获取或设置页面上的滚动元素或者整个窗口向右滚动的像素值*
  49. scrollTop *获取或设置页面上的滚动元素或者整个窗口向下滚动的像素值*
  50. show
  51. siblings *获取对象集合中所有元素的兄弟节点*
  52. size *获取对象集合中元素的数量*
  53. slice *提取这个数组array的子集*
  54. text *获取或者设置所有对象集合中元素的文本内容*
  55. toggle *显示或隐藏匹配元素*
  56. toggleClass *在匹配的元素集合中的每个元素上添加或删除一个或多个样式类*
  57. unwrap *移除集合中每个元素的直接父节点，并把他们的子元素保留在原来的位置*
  58. val *获取或设置匹配元素的值*
  59. width *获取对象集合中第一个元素的宽；或者设置对象集合中所有元素的宽*
  60. off *移除通过 on 添加的事件.移除一个特定的事件处理程序*
  61. on *添加事件处理程序到对象集合中得元素上*
  62. one *加一个处理事件到元素，当第一次执行事件以后，该事件将自动解除绑定*
  63. trigger *在对象集合的元素上触发指定的事件*
  64. triggerHandler *只在当前元素上触发事件，但不冒泡*

### 使用 CSS Modules
- 在小程序端开启
  ```jsx
  //config/index.js
  weapp: {
  module: {
    postcss: {
      // css modules 功能开关与相关配置
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module，下文详细说明
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}
  ```
- 在 H5 端开启
  ```jsx
  //config/index.js
  h5: {
  module: {
    postcss: {
      // css modules 功能开关与相关配置
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module，下文详细说明
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}
  ```

- 转换模式
  *namingPattern 配置取值分别如下：
    global，表示全局转换，所有样式文件都会经过CSS Modules转换，除了文件名中包含 .global.的样式文件
    module，表示自定义转换，只有文件名中包含.module.的样式文件会经过CSS Modules转换处理*

### 使用 MobX
- 安装
  ```jsx
  npm install --save mobx@4.8.0 @tarojs/mobx @tarojs/mobx-h5 @tarojs/mobx-rn
  ```

- API
  1. onError *异常监听*
  ```jsx
  import { onError } from '@tarojs/mobx'
  onError(error => {
  	console.log('mobx global error listener:', error)
  })
  ```
  2. observer *将组件设置为监听者，以便在可观察对象的值改变后触发页面的重新渲染*
  
   ```jsx
   import Taro from '@tarojs/taro'
   import {View, Text} from '@tarojs/components'
   import {observer} from '@tarojs/mobx'
	 function Index() {
	   const {counter} = store;
	   return (
	   	<View>
	   		<Text>{counter}</Text>
	   	</View>
     )
   }
   export default observer(Index)
   ```
  
     ```jsx
     // 错误，在小程序中值改变后将无法触发重新渲染
     const { counterStore } = this.props
     return (
     	<Text>{counterStore.counter}</Text>
     )
     
     // 正确
     const { counterStore: { counter } } = this.props
     return (
     	<Text>{counter}</Text>
     )
     ```

  3. observable *定义可观察对象*
  ```jsx
  //请确保该属性已经初始化
  @observable counter // 错误，值改变后将无法触发重新渲染
  @observable counter = 0 // 正确
  ```
  
  4. useLocalStore
      *将对象转换为 observable 对象*
      *getter 方法会被转换为 computed 属性*
      *方法会与 store 进行绑定并自动执行 mobx transactions*
      *一般情况下仅用于组件内部*
      
        ```jsx
        import Taro from '@tarojs/taro'
        import { View, Text, Button } from '@tarojs/components'
        import { useLocalStore,  observer } from '@tarojs/mobx'
      
        function Index() {
          const store = useLocalStore(() => ({
            counter: 0,
            increment() {
              store.counter++
            },
            decrement() {
              store.counter--
            },
            incrementAsync() {
              setTimeout(() => store.counter++, 1000)
            },
            get counterPlus() {
            	return store.counter+1
            }
        	}))
      
          const { counter, increment, decrement, incrementAsync } = store;
          return (
            <View>
              <Button onClick={increment}>+</Button>
              <Button onClick={decrement}>-</Button>
              <Button onClick={incrementAsync}>Add Async</Button>
              <Text>{counter}</Text>
            </View>
          )
      }
      
      export default observer(Index)
      
        ```

  5. useAsObservableSource
      *将纯对象(不包含getter或方法)转换为observable*
      *一般将对象属性进行转换，而后在useLocalStore对象中进行引用，这样在外部属性改变时自动通知useLocalStore对象对变化进行响应*
      ```jsx
      import Taro from '@tarojs/taro'
      import { View, Button, Text } from '@tarojs/components'
      import { useAsObservableSource, useLocalStore, observer } from '@tarojs/mobx'
      function Multiplier(props) {
        const observableProps = useAsObservableSource(props)
        const store = useLocalStore(() => ({
          counter: 1,
          get multiplied() {
            return observableProps.multiplier * store.counter
          },
          increment() {
            store.counter += 1
          }
        }))
        const { multiplier } = observableProps
        const { multiplied, counter, increment } = store
        return (
          <View>
            <Text>multiplier({multiplier}) * counter({counter}) = {multiplied}</Text>
            <Button onClick={increment}>Increment Counter</Button>
          </View>
        )
      }

      export default observer(Multiplier)
      ```

      ```jsx
      import Taro from '@tarojs/taro'
      import { View, Button, Text } from '@tarojs/components'
      import { useLocalStore, observer } from '@tarojs/mobx'

      function Multiplier(props) {
        const store = useLocalStore(source => ({
          counter: 1,

          get multiplier() {
            return source.multiplier
          },

          get multiplied() {
            return source.multiplier * store.counter
          },
          increment() {
            store.counter += 1
          }
        }), props)
        const { multiplied, counter, increment, multiplier } = store
        return (
          <View>
            <Text>multiplier({multiplier}) * counter({counter}) = {multiplied}</Text>
            <Button onClick={increment}>Increment Counter</Button>
          </View>
        )
      }

      export default observer(Multiplier)
      ```

### [使用H5标签](https://taro-docs.jd.com/taro/docs/use-h5)
##### 配置与使用
```jsx
npm i @tarojs/plugin-html -D
npm i babel-plugin-import -D
npm i @pmmmwh/react-refresh-webpack-plugin -D
npm i @tarojs/taro@3.5.3 -D
npm i antd-mobile@5.21.0
```

```jsx
// config/index.js
config = {
  plugins: ['@tarojs/plugin-html']
}
```
```jsx
function Index () {
  return (
    <div>Hello World!</div>
  )
}
```

```jsx
// babel.config
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: false
    }]
  ],
  plugins: [["import", { "libraryName": "antd-mobile", "libraryDirectory": "es/components", "style": false}]]
}
```
```jsx
// config/index.js
 plugins: [
    ['@tarojs/plugin-html', {
      pxtransformBlackList: [/^am-/, /^adm-/, /^--adm-/, /^demo-/, /^body/]
    }]
  ],
```
```jsx
// app.less
page {
    --adm-radius-s: 4Px;
    --adm-radius-m: 8Px;
    --adm-radius-l: 12Px;
    --adm-font-size-1: 9Px;
    --adm-font-size-2: 10Px;
    --adm-font-size-3: 11Px;
    --adm-font-size-4: 12Px;
    --adm-font-size-5: 13Px;
    --adm-font-size-6: 14Px;
    --adm-font-size-7: 15Px;
    --adm-font-size-8: 16Px;
    --adm-font-size-9: 17Px;
    --adm-font-size-10: 18Px;
    --adm-color-primary: #1677ff;
    --adm-color-success: #00b578;
    --adm-color-warning: #ff8f1f;
    --adm-color-danger: #ff3141;
    --adm-color-white: #ffffff;
    --adm-color-text: #333333;
    --adm-color-text-secondary: #666666;
    --adm-color-weak: #999999;
    --adm-color-light: #cccccc;
    --adm-color-border: #eeeeee;
    --adm-color-box: #f5f5f5;
    --adm-color-background: #ffffff;
    --adm-font-size-main: var(--adm-font-size-5);
    --adm-font-family: -apple-system, blinkmacsystemfont, 'Helvetica Neue',
      helvetica, segoe ui, arial, roboto, 'PingFang SC', 'miui',
      'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
    --adm-border-color: var(--adm-color-border);
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  a,
  button {
    cursor: pointer;
  }
  a {
    color: var(--adm-color-primary);
    transition: opacity ease-in-out 0.2s;
  }
  a:active {
    opacity: 0.8;
  }
  .adm-plain-anchor {
    color: unset;
    transition: none;
  }
  .adm-plain-anchor:active {
    opacity: unset;
  }
  body.adm-overflow-hidden {
    overflow: hidden !important;
  }
  div.adm-px-tester {
    --size: 1;
    height: calc(var(--size) / 2 * 2Px);
    width: 0;
    position: fixed;
    right: -100vw;
    bottom: -100vh;
    -webkit-user-select: none;
            user-select: none;
    pointer-events: none;
  }
```
```jsx
// demo.jsx
import { View} from '@tarojs/components'
import { Button } from 'antd-mobile';
import './index.less'

function Index(props) {
  return (
    <View className='index'>
      <div>Hello World!</div>
      <div>
        <span>demo</span>
        <span>h5</span>
        <span>antd</span>
      </div>
      <Button color='primary' fill='solid' block size='large'>
        Solid
      </Button>
    </View>
  );
}

export default Index
```

##### 限制
* 浏览器默认样式
```jsx
import '@tarojs/taro/html.css'; //html4
import '@tarojs/taro/html5.css'; //html5
```
* 第三方组件库的尺寸变小了一倍
	配置 @tarojs/plugin-html 插件的 pxtransformBlackList
* span默认表现为块级样式
```jsx
// 方法一：只使用部分需要的浏览器默认样式
.h5-span {
  display: inline;
}

// 方法二：直接引入全套浏览器默认样式
import '@tarojs/taro/html.css';
```
* 不支持部分 CSS 选择器
	通配符 *
	媒体查询
	属性选择器，当属性不是对应小程序组件的内置属性时
* 不支持使用rem
* 不能同步获取元素尺寸
```jsx
const el = document.getElementById('#inner')
const res = await el.getBoundingClientRect()
console.log(res)
```
* DOM API 差异
```jsx
// h5
const el = document.getElementById('myVideo')
el.play()

// 小程序
const ctx = Taro.createVideoContext('myVideo')
ctx.play()
```
* img图片尺寸问题
	使用 <img> 时必须显式设置它的宽高
* 不支持 ReactDOM 部分 API
	如unstable_renderSubtreeIntoContainer
* 不支持 React Portal
* 不支持 Vue3 Teleport
* 不支持使用 SVG
##### 插件配置项
* pxtransformBlackList
	命中数组中任意正则表达式的类名选择器，其样式声明块中的 px 单位不会被 Taro 解析
```jsx
config = {
  plugins: [
    ['@tarojs/plugin-html', {
      // 包含 `demo-`、`van-` 的类名选择器中的 px 单位不会被解析
      pxtransformBlackList: [/demo-/, /van-/]
    }]
  ]
}
```
* modifyElements
	修改普通块级元素和行内元素的映射规则
```jsx
config = {
  plugins: [
    ['@tarojs/plugin-html', {
      modifyElements (inline: string[], block: string[]) {
        // 行内元素增加 <xxx>
        inline.push('xxx')
        // 行内元素添加 <span>，块级元素删除 <span>
        inline.push('span')
        block.splice(block.indexOf('span'), 1)
      }
    }]
  ]
}
```
* enableSizeAPIs
	设置是否能够使用 H5 同步获取元素尺寸的 API 的 异步版本，如 getBoundingClientRect
```jsx
config = {
  plugins: [
    ['@tarojs/plugin-html', {
      // 这些异步 API 的代码将会从运行时代码中删除
      enableSizeAPIs: false
    }]
  ]
}
```
* postcss配置
	@tarojs/plugin-html 会启用 postcss 插件：postcss-html-transform 对样式进行一些处理



### [API](https://taro-docs.jd.com/taro/docs/apis/)
  *对其他小程序的API会挂载在Taro命名空间下，可使用Taro.+API来进行调用，
  如wx.showModal可使用Taro.showModal调用，
  也可以使用对应小程序平台的命名空间(如 my、swan、tt等)来进行调用，
  Taro默认对小程序的异步API进行promisify化，可使用Promise进行调用*

##### 环境判断
- Taro.ENV_TYPE｜Taro.getEnv()
  ENV_TYPE.WEAPP			微信小程序环境
  ENV_TYPE.SWAN			百度小程序环境
  ENV_TYPE.ALIPAY 		支付宝小程序环境
  ENV_TYPE.TT 				字节跳动小程序环境
  ENV_TYPE.WEB 			WEB(H5)环境
  ENV_TYPE.RN 				ReactNative 环境
  ENV_TYPE.QUICKAPP 	快应用环境
  ENV_TYPE.QQ 				QQ小程序环境
  ENV_TYPE.JD 					京东小程序环境

##### 消息机制
  *提供Taro.Events来实现消息机制*
  ```jsx
  import Taro, {Events} from '@tarojs/taro'
  const events = new Events()
  events.on('eventName', (arg) => { //监听一个事件，接受参数
  })
  events.trigger('eventName', arg1, arg2, ...) //触发事件
  events.off('eventName')  //取消监听一个事件
  events.off('eventName', handler1) //取消监听一个事件某个handler
  events.off() // 取消监听所有事件
  ```
  ```jsx
  //全局消息中心 Taro.eventCenter
  import Taro from '@tarojs/taro'
  Taro.eventCenter.on()
  Taro.eventCenter.trigger()
  Taro.eventCenter.off()
  ```

##### 框架
App(object)  *注册小程序*
Page({route:string})  *注册小程序页面*
Taro.getApp({allowDefault:boolean}):App  *获取到小程序全局唯一App实例*
Taro.getCurrentPages():Page[]  *获取当前页面栈，数组第一个元素为首页，最后一个元素为当前页面*

##### 基础
Taro.canIUse(schema)  *判断小程序的 API，回调，参数，组件等是否在当前版本可用*
Taro.base64ToArrayBuffer(base64)  *将 Base64 字符串转成 ArrayBuffer 数据*
Taro.arrayBufferToBase64(buffer)  *将 ArrayBuffer 数据转成 Base64 字符串*

Taro.openAppAuthorizeSetting(option)  *跳转系统微信授权管理页*
Taro.getAppAuthorizeSetting()  *获取微信APP授权设置*
Taro.getSystemSetting()  *获取设备设置*
Taro.getSystemInfoSync()  *Taro.getSystemInfo同步版本*
Taro.getSystemInfoAsync(res)  *Taro.getSystemInfo异步版本*
Taro.getSystemInfo(res)  *获取系统信息*
Taro.getDeviceInfo()  *获取设备基础信息*
Taro.getAppBaseInfo()  *获取微信APP基础信息*
Taro.getAppAuthorizeSetting()  *获取微信APP授权设置*
Taro.getWindowInfo()  *获取窗口信息*
Taro.getLaunchOptionsSync()  *获取小程序启动时的参数*
Taro.getEnterOptionsSync()  *获取本次小程序启动时的参数*

Taro.onUnhandledRejection(callback)  *监听未处理的 Promise 拒绝事件*
Taro.onThemeChange(callback)  *监听系统主题改变事件*
Taro.onPageNotFound(callback)  *监听小程序要打开的页面不存在事件*
Taro.onError(callback)  *监听小程序错误事件*
Taro.onAudioInterruptionEnd(callback)  *监听音频中断结束事件*
Taro.onAudioInterruptionBegin(callback)  *监听音频因为受到系统占用而被中断开始事件*
Taro.onAppShow(callback)  *监听小程序切前台事件*
Taro.onAppHide(callback)  *监听小程序切后台事件*
Taro.offUnhandledRejection(callback)
Taro.offThemeChange(callback)
Taro.offPageNotFound(callback)
Taro.offError(callback)
Taro.offAudioInterruptionEnd(callback)
Taro.offAudioInterruptionBegin(callback)
Taro.offAppShow(callback)
Taro.offAppHide(callback)

console.debug
console.error
console.group
console.groupEnd
console.info
console.log
console.warn

##### 路由
Taro.switchTab(option:{url, complete, fail, success}):Promise<CallbackResult>  *跳转到tabBar页面*
Taro.redirectTo(option)  *关闭当前页面，跳转到应用内的某个页面，不允许跳转到 tabbar页面*
Taro.navigateTo(option)  *保留当前页面，跳转到应用内的某个页面，不允许跳转到 tabbar页面*
Taro.reLaunch(option)  *关闭所有页面，打开到应用内的某个页面*
Taro.navigateBack(option:{delta, complete, fail, success})  *关闭当前页面，返回上一页面或多级页面*

##### EventChannel 页面间事件通信通道
EventChannel.emit(eventName, args)
EventChannel.on(eventName, fn)
EventChannel.once(eventName, fn)
EventChannel.off(eventName, fn)

##### 跳转
Taro.openEmbeddedMiniProgram(option)  *打开半屏小程序*
Taro.navigateToMiniProgram(option)  *打开另一个小程序*
Taro.navigateBackMiniProgram(option)  *返回到上一个小程序*
Taro.exitMiniProgram(option)  *退出当前小程序*

##### 转发
Taro.showShareMenu(option)  *显示当前页面的转发按钮*
Taro.hideShareMenu(option)  *隐藏当前页面的转发按钮*
Taro.getShareInfo(option)  *获取转发详细信息*
Taro.updateShareMenu(option)  *更新转发属性*
Taro.showShareImageMenu(option)  *打开分享图片弹窗，可以将图片发送给朋友、收藏或下载*
Taro.shareVideoMessage(option)  *转发视频到聊天*
Taro.shareFileMessage(option)  *转发文件到聊天*
Taro.onCopyUrl(callback)  *监听用户点击右上角菜单的「复制链接」按钮时触发的事件，暂只在 Android 平台支持*
Taro.offCopyUrl(callback)  *取消监听用户点击右上角菜单的「复制链接」按钮时触发的事件*
Taro.authPrivateMessage(option)  *验证私密消息*

##### 界面


##### 网络

##### 媒体

##### 文件

##### 设备

### [组件库](https://taro-docs.jd.com/taro/docs/components-desc)
##### 视图容器
##### 基础内容
##### 表单组件
##### 媒体组件
##### 导航

### 渐进式入门教程
https://taro-docs.jd.com/taro/docs/guide/
