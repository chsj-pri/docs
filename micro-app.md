### 安装配置

https://micro-zoe.github.io/micro-app/

```shell
npm i @micro-zoe/micro-app --save
```

```js
// index.js
import microApp from '@micro-zoe/micro-app'

microApp.start()
```

```js
export function MyPage () {
  return (
    <div>
      <h1>子应用👇</h1>
      // name：应用名称, url：应用地址
      <micro-app name='my-app' url='http://localhost:3000/'></micro-app>
    </div>
  )
}
```

```js
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
},
```

### 配置项

##### name  `应用名称`

##### url  `应用地址`

##### iframe  `开启iframe沙箱  with沙箱`

##### inline  `使用内联script`

##### destroy  `卸载时强制删除缓存资源`

##### clear-data  `卸载时清空数据通讯中的缓存数据`

##### disable-scopecss  `关闭样式隔离`

##### disable-sandbox  `关闭js沙箱`

##### ssr  `开启ssr模式`

##### keep-alive  `开启keep-alive模式`

##### default-page  `指定默认渲染的页面`

##### router-mode  `路由模式`

##### baseroute  `设置子应用的基础路由`

##### keep-router-state  `保留路由状态`

##### disable-memory-router  `关闭虚拟路由系统`

##### disable-patch-request  `关闭子应用请求的自动补全功能`

##### fiber  `开启fiber模式`

### 全局配置

```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  iframe: true, // 全局开启iframe沙箱，默认为false
  inline: true, // 全局开启内联script模式运行js，默认为false
  destroy: true, // 全局开启destroy模式，卸载时强制删除缓存资源，默认为false
  ssr: true, // 全局开启ssr模式，默认为false
  'disable-scopecss': true, // 全局禁用样式隔离，默认为false
  'disable-sandbox': true, // 全局禁用沙箱，默认为false
  'keep-alive': true, // 全局开启保活模式，默认为false
  'disable-memory-router': true, // 全局关闭虚拟路由系统，默认值false
  'keep-router-state': true, // 子应用在卸载时保留路由状态，默认值false
  'disable-patch-request': true, // 关闭子应用请求的自动补全功能，默认值false
  iframeSrc: location.origin, // 设置iframe沙箱中iframe的src地址，默认为子应用所在页面地址
})
```

### 其它配置

###### global  将文件提取为公共文件，共享给其它应用

```js
  <link rel="stylesheet" href="xx.css" global>
  <script src="xx.js" global></script>
```

###### globalAssets  设置全局共享资源，预加载

```js
// index.js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  globalAssets: {
    js: ['js地址1', 'js地址2', ...], // js地址
    css: ['css地址1', 'css地址2', ...], // css地址
  }
})
```

###### exclude  过滤元素

```js
  <link rel="stylesheet" href="xx.css" exclude>
  <script src="xx.js" exclude></script>
  <style exclude></style>
```

###### ignore 忽略元素

```js
  // 修改jsonp方法，在创建script元素后添加ignore属性
  const script = document.createElement('script')
  script.setAttribute('ignore', 'true')
```

### 生命周期

#### [1. created](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/life-cycles?id=_1-created)

`<micro-app>`标签初始化后，加载资源前触发

#### [2. beforemount](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/life-cycles?id=_2-beforemount)

加载资源完成后，开始渲染之前触发

#### [3. mounted](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/life-cycles?id=_3-mounted)

子应用渲染结束后触发

#### [4. unmount](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/life-cycles?id=_4-unmount)

子应用卸载时触发

#### [5. error](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/life-cycles?id=_5-error)

子应用加载出错时触发，只有会导致渲染终止的错误才会触发此生命周期

### 监听生命周期

```js
/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
// React不支持自定义事件，所以我们需要引入一个polyfill
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'

<micro-app  name='xx'
  url='xx'
  onCreated={() => console.log('micro-app元素被创建')}
  onBeforemount={() => console.log('即将渲染')}
  onMounted={() => console.log('已经渲染完成')}
  onUnmount={() => console.log('已经卸载')}
  onError={() => console.log('加载出错')}
/>
```

```js
const myApp = document.querySelector('micro-app[name=my-app]')

myApp.addEventListener('created', () => {
  console.log('created')
})

myApp.addEventListener('beforemount', () => {
  console.log('beforemount')
})

myApp.addEventListener('mounted', () => {
  console.log('mounted')
})

myApp.addEventListener('unmount', () => {
  console.log('unmount')
})

myApp.addEventListener('error', () => {
  console.log('error')
})
```

### 全局监听

在每个应用的生命周期执行时都会触发

```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  lifeCycles: {
    created (e, appName) {
      console.log(`子应用${appName}被创建`)
    },
    beforemount (e, appName) {
      console.log(`子应用${appName}即将渲染`)
    },
    mounted (e, appName) {
      console.log(`子应用${appName}已经渲染完成`)
    },
    unmount (e, appName) {
      console.log(`子应用${appName}已经卸载`)
    },
    error (e, appName) {
      console.log(`子应用${appName}加载出错`)
    }
  }
})
```

### 全局事件

在子应用的加载过程中，micro-app会向子应用发送一系列事件，包括渲染、卸载等事件

###### 渲染事件

```js
/** * 应用渲染时执行 * @param data 初始化数据 */
window.onmount = (data) => {
  console.log('子应用已经渲染', data)
}
```

###### 卸载事件

```
/** * 应用卸载时执行 */
window.onunmount = () => {
  // 执行卸载相关操作
  console.log('子应用已经卸载')
}
```

```js
window.addEventListener('unmount', function () {
  // 执行卸载相关操作
  console.log('子应用已经卸载')
})
```

### 环境变量

###### __MICRO_APP_ENVIRONMENT__

`判断应用是否在微前端环境中`

```
if (window.__MICRO_APP_ENVIRONMENT__) {
  console.log('我在微前端环境中')
}
```

###### __MICRO_APP_NAME__

`应用名称`

###### __MICRO_APP_PUBLIC_PATH__

`子应用的静态资源前缀`

```
if (window.__MICRO_APP_ENVIRONMENT__) {
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__
}
```

###### __MICRO_APP_BASE_ROUTE__

`子应用的基础路由`

- __MICRO_APP_BASE_APPLICATION__

`判断应用是否是主应用`

```js
if (window.__MICRO_APP_BASE_APPLICATION__) {
  console.log('我是主应用')
}
```

### 虚拟路由系统

##### 路由模式 `search`、`native`、`native-scope`、`pure`

##### 导航

###### router.push  `控制子应用跳转，并向路由堆栈添加一条新的记录`

```js
/** 
* @param {string} name 必填，子应用的name 
* @param {string} path 必填，子应用除域名外的全量地址(也可以带上域名) 
* @param {boolean} replace 可选，是否使用replace模式，不新增堆栈记录，默认为false 
*/
router.push({ name: '子应用名称', path: '页面地址', replace: 是否使用replace模式 })
```

```js
import microApp from '@micro-zoe/micro-app'

// 不带域名的地址，控制子应用my-app跳转/page1
microApp.router.push({name: 'my-app', path: '/page1'})

// 带域名的地址，控制子应用my-app跳转/page1
microApp.router.push({name: 'my-app', path: 'http://localhost:3000/page1'})

// 带查询参数，控制子应用my-app跳转/page1?id=9527
microApp.router.push({name: 'my-app', path: '/page1?id=9527'})

// 带hash，控制子应用my-app跳转/page1#hash
microApp.router.push({name: 'my-app', path: '/page1#hash'})

// 使用replace模式，等同于 router.replace({name: 'my-app', path: '/page1'})
microApp.router.push({name: 'my-app', path: '/page1', replace: true })
```

###### router.replace  `控制子应用跳转，替换最新的堆栈记录`

```js
/** 
* @param {string} name 必填，子应用的name 
* @param {string} path 必填，子应用除域名外的全量地址(也可以带上域名) 
* @param {boolean} replace 可选，是否使用replace模式，默认为true 
*/
router.replace({ name: '子应用名称', path: '页面地址', replace: 是否使用replace模式 })
```

###### router.go  `功能和window.history.go(n)一致，表示在历史堆栈中前进或后退多少步`

```js
/** * @param {number} n 前进或后退多少步 */
router.go(n)
```

```js
import microApp from '@micro-zoe/micro-app'

// 返回一条记录
microApp.router.go(-1)

// 前进 3 条记录
microApp.router.go(3)
```

###### router.back  `功能和window.history.back()一致，表示在历史堆栈中后退一步`

```js
import microApp from '@micro-zoe/micro-app'

// 返回一条记录
microApp.router.back()
```

- router.forward  `功能和window.history.forward()一致，表示在历史堆栈中前进一步`

```js
import microApp from '@micro-zoe/micro-app'

// 前进一条记录
microApp.router.forward()
```

##### 设置默认页面

```js
<!-- 不带域名的地址 -->
<micro-app name='my-app' url='http://localhost:3000/' default-page='/page1'></micro-app>

<!-- 带域名的地址 -->
<micro-app name='my-app' url='http://localhost:3000/' default-page='http://localhost:3000/page1'></micro-app>

<!-- 带查询参数 -->
<micro-app name='my-app' url='http://localhost:3000/' default-page='/page1?id=9527'></micro-app>

<!-- 带hash -->
<micro-app name='my-app' url='http://localhost:3000/' default-page='/page1#hash'></micro-app>
```

```js
import microApp from '@micro-zoe/micro-app'

// 不带域名的地址
microApp.router.setDefaultPage({name: 'my-app', path: '/page1'})

// 带域名的地址
microApp.router.setDefaultPage({name: 'my-app', path: 'http://localhost:3000/page1'})

// 带查询参数
microApp.router.setDefaultPage({name: 'my-app', path: '/page1?id=9527'})

// 带hash
microApp.router.setDefaultPage({name: 'my-app', path: '/page1#hash'})

// 删除子应用my-app的默认页面
router.removeDefaultPage('my-app')

// 获取子应用my-app的默认页面
const defaultPage = router.getDefaultPage('my-app')
```

##### 导航守卫

###### 全局前置守卫  `监听所有或某个子应用的路由变化，在子应用页面渲染前执行`

```js
  /** 
  * @param {object} to 即将要进入的路由 
  * @param {object} from 正要离开的路由 
  * @param {string} name 子应用的name 
  * @return cancel function 解绑路由监听函数 
  */
  router.beforeEach((to, from, name) => {} | { name: (to, from) => {} })
```

```js
  import microApp from '@micro-zoe/micro-app'

  // 监听所有子应用的路由变化
  microApp.router.beforeEach((to, from, appName) => {
    console.log('全局前置守卫 beforeEach: ', to, from, appName)
  })

  // 监听某个子应用的路由变化
  microApp.router.beforeEach({
    子应用1name (to, from) {
      console.log('指定子应用的前置守卫 beforeEach ', to, from)
    },
    子应用2name (to, from) {
      console.log('指定子应用的前置守卫 beforeEach ', to, from)
    }
  })

  // beforeEach会返回一个解绑函数
  const cancelCallback = microApp.router.beforeEach((to, from, appName) => {
    console.log('全局前置守卫 beforeEach: ', to, from, appName)
  })

  // 解绑路由监听
  cancelCallback()
```

###### 全局后置守卫  `监听所有或某个子应用的路由变化，在子应用页面渲染后执行`

```js
/** 
* @param {object} to 已经进入的路由 
* @param {object} from 已经离开的路由 
* @param {string} name 子应用的name 
* @return cancel function 解绑路由监听函数 
*/
router.afterEach((to, from, name) => {} | { name: (to, from) => {} })
```

```js
import microApp from '@micro-zoe/micro-app'

// 监听所有子应用的路由变化
microApp.router.afterEach((to, from, appName) => {
  console.log('全局后置守卫 afterEach: ', to, from, appName)
})

// 监听某个子应用的路由变化
microApp.router.afterEach({
  子应用1name (to, from) {
    console.log('指定子应用的后置守卫 afterEach ', to, from)
  },
  子应用2name (to, from) {
    console.log('指定子应用的后置守卫 beforeEach ', to, from)
  }
})

// afterEach会返回一个解绑函数
const cancelCallback = microApp.router.afterEach((to, from, appName) => {
  console.log('全局后置守卫 afterEach: ', to, from, appName)
})

// 解绑路由监听
cancelCallback()
```

##### 获取路由信息

```js
/** * @param {string} name 必填，子应用的name */
router.current.get(name)
```

```js
import microApp from '@micro-zoe/micro-app'

// 获取子应用my-app的路由信息，返回值与子应用的location相同
const routeInfo = microApp.router.current.get('my-app')
```

```js
// 获取子应用my-app的路由信息，返回值与子应用的location相同
const routeInfo = window.microApp.router.current.get('my-app')
```

##### 编解码

```js
/** 
* 编码 
* @param {string} path 必填，页面地址 
*/
router.encode(path: string)

/** 
* 解码 
* @param {string} path 必填，页面地址 
*/
router.decode(path: string)
```

```js
import microApp from '@micro-zoe/micro-app'

// 返回 %2Fpage1%2F
const encodeResult = microApp.router.encode('/page1/')

// 返回 /page1/
const encodeResult = microApp.router.decode('%2Fpage1%2F')
```

```js
// 返回 %2Fpage1%2F
const encodeResult = window.microApp.router.encode('/page1/')

// 返回 /page1/
const encodeResult = window.microApp.router.decode('%2Fpage1%2F')
```

##### 同步路由信息  `主动将子应用的路由信息同步到浏览器地址上`

```js
/** 
* 将指定子应用的路由信息同步到浏览器地址上 
* 如果应用未渲染或已经卸载，则方法无效 
* @param {string} name 子应用的名称 
*/
router.attachToURL(name: string)

/** 
* 将所有正在运行的子应用路由信息同步到浏览器地址上 
* 它接受一个对象作为参数，详情如下： 
* @param {boolean} includeHiddenApp 是否包含已经隐藏的keep-alive应用，默认为false 
* @param {boolean} includePreRender 是否包含预渲染应用，默认为false 
*/
router.attachAllToURL({
  includeHiddenApp?: boolean,
  includePreRender?: boolean,
})
```

```js
import microApp from '@micro-zoe/micro-app'

// 将my-app的路由信息同步到浏览器地址上
microApp.router.attachToURL('my-app')

// 将所有正在运行的子应用路由信息同步到浏览器地址上，不包含处于隐藏状态的keep-alive应用和预渲染应用
microApp.router.attachAllToURL()

// 将所有正在运行的子应用路由信息同步到浏览器地址上，包含处于隐藏状态的keep-alive应用
microApp.router.attachAllToURL({ includeHiddenApp: true })

// 将所有正在运行的子应用路由信息同步到浏览器地址上，包含预渲染应用
microApp.router.attachAllToURL({ includePreRender: true })
```

### JS沙箱

- 子应用在沙箱环境中如何获取到真实window
  
  1、new Function("return window")() 或 Function("return window")()
  
  2、(0, eval)('window')
  
  3、window.rawWindow

### 样式隔离

```css
.test {
  color: red;
}

/* 转换为 */
micro-app[name=xxx] .test {
  color: red;
}
```

**禁用样式隔离**

```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  disableScopecss: true, // 默认值false
})
```

```js
<micro-app name='xx' url='xx' disableScopecss 或 disable-scopecss></micro-app>
```

```
/*! scopecss-disable */
.test1 {
  color: red;
}
/*! scopecss-enable */
```

```
/*! scopecss-disable .test1, .test2 */
.test1 {
  color: red;
}
.test2 {
  color: yellow;
}
.test3 {
  color: green;
}
/*! scopecss-enable */
```

```
/*! scopecss-disable */
...
```

```
/*! scopecss-disable-next-line */
.test1 {
  color: red;
}

.test2 {
  /*! scopecss-disable-next-line */
  background: url(/test.png);
}
```

### 元素隔离

**解除元素绑定**

```js
import { removeDomScope } from '@micro-zoe/micro-app'

// 解除元素绑定，并且一定时间内阻止再次绑定(一个微任务Promise时间)
removeDomScope(true) // 或者 removeDomScope()

const div = window.document.createElement('div')
// 插入到主应用body中
document.body.appendChild(div) 
```

```js
// 解除元素绑定，并且一定时间内阻止再次绑定(一个微任务Promise时间)
window.microApp.removeDomScope(true) // 或者 window.microApp.removeDomScope()

const div = window.rawDocument.createElement('div')
// 插入到主应用body中
document.body.appendChild(div) 
```

```js
// 等待解绑结束后操作元素
setTimeout(() => {
  const div = window.document.createElement('div')
  // 插入到主应用body中
  document.body.appendChild(div) 
}, 0)
```

```js
// 记录主应用document
const rawDocument = window.rawDocument

// 等待解绑结束后操作元素
setTimeout(() => {
  const div = rawDocument.createElement('div')
  // 插入到主应用body中
  rawDocument.body.appendChild(div) 
}, 0)
```

### 数据通信

###### 子应用获取来自主应用的数据

```js
const data = window.microApp.getData() // 返回主应用下发的data数据
```

```js
/** 
* 绑定监听函数，监听函数只有在数据变化时才会触发 
* dataListener: 绑定函数 
* autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false 
* !!!重要说明: 因为子应用是异步渲染的，而主应用发送数据是同步的， 
* 如果在子应用渲染结束前主应用发送数据，则在绑定监听函数前数据已经发送，在初始化后不会触发绑定函数， 
* 但这个数据会放入缓存中，此时可以设置autoTrigger为true主动触发一次监听函数来获取数据。 
*/
window.microApp.addDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
window.microApp.removeDataListener(dataListener: (data: Object) => any)

// 清空当前子应用的所有绑定函数(全局数据函数除外)
window.microApp.clearDataListener()
```

```js
// 监听函数
function dataListener (data) {
  console.log('来自主应用的数据', data)
}

// 监听数据变化
window.microApp.addDataListener(dataListener)

// 监听数据变化，初始化时如果有数据则主动触发一次
window.microApp.addDataListener(dataListener, true)

// 解绑监听函数
window.microApp.removeDataListener(dataListener)

// 清空当前子应用的所有绑定函数(全局数据函数除外)
window.microApp.clearDataListener()
```

###### 子应用向主应用发送数据

```js
// dispatch只接受对象作为参数
window.microApp.dispatch({type: '子应用发送给主应用的数据'})
```

```js
// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送 
window.microApp.dispatch({name: 'jack'})

// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送 
window.microApp.dispatch({age: 20})

// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
window.microApp.dispatch({age: 20})
```

```js
window.microApp.dispatch({city: 'HK'}, () => {
  console.log('数据已经发送完成')
})
```

```js
// 主应用
import microApp from '@micro-zoe/micro-app'

microApp.addDataListener('my-app', (data) => {
  console.log('来自子应用my-app的数据', data)

  return '返回值1'
})

microApp.addDataListener('my-app', (data) => {
  console.log('来自子应用my-app的数据', data)

  return '返回值2'
})

// 子应用
// 返回值会放入数组中传递给dispatch的回调函数
window.microApp.dispatch({city: 'HK'}, (res: any[]) => {
  console.log(res) // ['返回值1', '返回值2']
})
```

```js
// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
window.microApp.forceDispatch({name: 'jack'}, () => {
  console.log('数据已经发送完成')
})
```

###### 主应用向子应用发送数据

```js
// 在<micro-app>元素所在的文件顶部添加polyfill(注释也要复制)

/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'

<micro-app  name='my-app'
  url='xx'
  data={this.state.dataForChild} // data只接受对象类型，采用严格对比(===)，当传入新的data对象时会重新发送
/>
```

```js
import microApp from '@micro-zoe/micro-app'

// 发送数据给子应用 my-app，setData第二个参数只接受对象类型
microApp.setData('my-app', {type: '新的数据'})
```

```js
// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送 
microApp.setData('my-app', {name: 'jack'})

// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送 
microApp.setData('my-app', {age: 20})

// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
microApp.setData('my-app', {age: 20})
```

```js
microApp.setData('my-app', {city: 'HK'}, () => {
  console.log('数据已经发送完成')
})
```

```js
// 主应用
// 返回值会放入数组中传递给setData的回调函数
microApp.setData('my-app', {city: 'HK'}, (res: any[]) => {
  console.log(res) // ['返回值1', '返回值2']
})

// 子应用
window.microApp.addDataListener((data) => {
  console.log('来自主应用的数据', data)

  return '返回值1'
})

window.microApp.addDataListener((data) => {
  console.log('来自主应用的数据', data)

  return '返回值2'
})
```

```js
// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
microApp.forceSetData('my-app', {name: 'jack'}, () => {
  console.log('数据已经发送完成')
})
```

###### 主应用获取来自子应用的数据

```js
import microApp from '@micro-zoe/micro-app'

const childData = microApp.getData(appName) // 返回子应用的data数据
```

```js
/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'

<micro-app
  name='my-app'
  url='xx'
  // 数据在event.detail.data字段中，子应用每次发送数据都会触发datachange
  onDataChange={(e) => console.log('来自子应用的数据：', e.detail.data)}
/>
```

```js
import microApp from '@micro-zoe/micro-app'

/** * 绑定监听函数 * appName: 应用名称 * dataListener: 绑定函数 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false */
microApp.addDataListener(appName: string, dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听指定子应用的函数
microApp.removeDataListener(appName: string, dataListener: (data: Object) => any)

// 清空所有监听指定子应用的函数
microApp.clearDataListener(appName: string)
```

```js
import microApp from '@micro-zoe/micro-app'

// 监听函数
function dataListener (data) {
  console.log('来自子应用my-app的数据', data)
}

// 监听来自子应用my-app的数据
microApp.addDataListener('my-app', dataListener)

// 解绑监听my-app子应用的函数
microApp.removeDataListener('my-app', dataListener)

// 清空所有监听my-app子应用的函数
microApp.clearDataListener('my-app')
```

###### 清空数据

- 配置项 - clear-data

- 手动清空 - clearData

```js
import microApp from '@micro-zoe/micro-app'

// 清空主应用发送给子应用 my-app 的数据
microApp.clearData('my-app')
```

```js
// 清空当前子应用发送给主应用的数据
window.microApp.clearData()
```

###### 全局数据通信

```js
import microApp from '@micro-zoe/micro-app'

// setGlobalData只接受对象作为参数
microApp.setGlobalData({type: '全局数据'})

// setGlobalData只接受对象作为参数
window.microApp.setGlobalData({type: '全局数据'})
```

```js
// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送 
microApp.setGlobalData({name: 'jack'})

// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送 
microApp.setGlobalData({age: 20})

// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
microApp.setGlobalData({age: 20})

// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送 
window.microApp.setGlobalData({name: 'jack'})

// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送 
window.microApp.setGlobalData({age: 20})

// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
window.microApp.setGlobalData({age: 20})
```

```js
microApp.addGlobalDataListener((data) => {
  console.log('全局数据', data)

  return '返回值1'
})

microApp.addGlobalDataListener((data) => {
  console.log('全局数据', data)

  return '返回值2'
})

window.microApp.addGlobalDataListener((data) => {
  console.log('全局数据', data)

  return '返回值1'
})

window.microApp.addGlobalDataListener((data) => {
  console.log('全局数据', data)

  return '返回值2'
})

// 返回值会放入数组中传递给setGlobalData的回调函数
microApp.setGlobalData({city: 'HK'}, (res: any[]) => {
  console.log(res) // ['返回值1', '返回值2']
})

// 返回值会放入数组中传递给setGlobalData的回调函数
window.microApp.setGlobalData({city: 'HK'}, (res: any[]) => {
  console.log(res) // ['返回值1', '返回值2']
})

// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
microApp.forceSetGlobalData({name: 'jack'}, () => {
  console.log('数据已经发送完成')
})

// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
window.microApp.forceSetGlobalData({name: 'jack'}, () => {
  console.log('数据已经发送完成')
})
```

```js
import microApp from '@micro-zoe/micro-app'

// 直接获取数据
const globalData = microApp.getGlobalData() // 返回全局数据

function dataListener (data) {
  console.log('全局数据', data)
}

/** * 绑定监听函数 * dataListener: 绑定函数 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false */
microApp.addGlobalDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
microApp.removeGlobalDataListener(dataListener: (data: Object) => any)

// 清空主应用绑定的所有全局数据监听函数
microApp.clearGlobalDataListener()


// 直接获取数据
const globalData = window.microApp.getGlobalData() // 返回全局数据

function dataListener (data) {
  console.log('全局数据', data)
}

/**
 * 绑定监听函数
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
window.microApp.addGlobalDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
window.microApp.removeGlobalDataListener(dataListener: (data: Object) => any)

// 清空当前子应用绑定的所有全局数据监听函数
window.microApp.clearGlobalDataListener()
```

```js
// 清空全局数据
import microApp from '@micro-zoe/micro-app'

// 清空全局数据
microApp.clearGlobalData()

// 清空全局数据
window.microApp.clearGlobalData()
```

###### 关闭沙箱后的通信方式

```js
import { EventCenterForMicroApp } from '@micro-zoe/micro-app'

// 注意：每个子应用根据appName单独分配一个通信对象
window.eventCenterForAppxx = new EventCenterForMicroApp(appName)

// 直接获取数据
const data = window.eventCenterForAppxx.getData() // 返回data数据

function dataListener (data) {
  console.log('来自主应用的数据', data)
}

/**
 * 绑定监听函数
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
window.eventCenterForAppxx.addDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
window.eventCenterForAppxx.removeDataListener(dataListener: (data: Object) => any)

// 清空当前子应用的所有绑定函数(全局数据函数除外)
window.eventCenterForAppxx.clearDataListener()

// 子应用向主应用发送数据，只接受对象作为参数
window.eventCenterForAppxx.dispatch({type: '子应用发送的数据'})
```

### 资源系统

##### 资源路径自动补全

##### publicPath

```js
// public-path.js
// __MICRO_APP_ENVIRONMENT__和__MICRO_APP_PUBLIC_PATH__是由micro-app注入的全局变量
if (window.__MICRO_APP_ENVIRONMENT__) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__
}

// 在子应用入口文件的最顶部引入public-path.js
// entry
import './public-path'

```

##### 资源共享

```js
// 方式一、globalAssets
// index.js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  globalAssets: {
    js: ['js地址1', 'js地址2', ...], // js地址
    css: ['css地址1', 'css地址2', ...], // css地址
  }
})

// 方式二、global 属性
<link rel="stylesheet" href="xx.css" global>
<script src="xx.js" global></script>
```

##### 资源过滤

```js
// 方式一：excludeAssetFilter
// index.js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  excludeAssetFilter (assetUrl) {
    if (assetUrl === 'xxx') {
      return true // 返回true则micro-app不会劫持处理当前文件
    }
    return false
  }
})

// 方式二：配置 exclude 属性
<link rel="stylesheet" href="xx.css" exclude>
<script src="xx.js" exclude></script>
<style exclude></style>

```

### 预加载

```js
microApp.preFetch(apps: app[] | () => app[], delay?: number)

app: {
  name: string, // 应用名称，必传
  url: string, // 应用地址，必传
  iframe: boolean, // 是否使用iframe沙箱，vite应用必传，其它应用可选
  inline: boolean, // 是否使用内联模式运行js，可选
  'disable-scopecss': boolean, // 是否关闭样式隔离，可选
  'disable-sandbox': boolean, // 是否关闭沙盒，可选
  level: number, // 预加载等级，可选（分为三个等级：1、2、3，1表示只加载资源，2表示加载并解析，3表示加载解析并渲染，默认为2）
  'default-page': string, // 指定默认渲染的页面，level为3时才会生效，可选
  'disable-patch-request': boolean, // 关闭子应用请求的自动补全功能，level为3时才会生效，可选
}

// delay 默认值：3000

// 修改delay的默认值
import microApp from '@micro-zoe/micro-app'
microApp.start({
  prefetchDelay: 5000, // 修改delay默认值为5000ms
})

// 修改level的默认值
import microApp from '@micro-zoe/micro-app'
microApp.start({
  prefetchLevel: 1, // 修改level默认值为1
})

```

```js
import microApp from '@micro-zoe/micro-app'

// 方式一：设置数组
microApp.preFetch([
  { name: 'my-app1', url: 'xxx' }, // 加载资源并解析
  { name: 'my-app2', url: 'xxx', level: 1 }, // 只加载资源
  { name: 'my-app3', url: 'xxx', level: 3 }, // 加载资源、解析并渲染
  { name: 'my-app4', url: 'xxx', level: 3, 'default-page': '/page2' }, // 加载资源、解析并渲染子应用的page2页面
])

// 方式二：设置一个返回数组的函数
microApp.preFetch(() => [
  { name: 'my-app1', url: 'xxx' }, // 加载资源并解析
  { name: 'my-app2', url: 'xxx', level: 1 }, // 只加载资源
  { name: 'my-app3', url: 'xxx', level: 3 }, // 加载资源、解析并渲染
  { name: 'my-app4', url: 'xxx', level: 3, 'default-page': '/page2' }, // 加载资源、解析并渲染子应用的page2页面
])

// 方式三：在start中设置预加载数组
microApp.start({
  preFetchApps: [
    { name: 'my-app1', url: 'xxx' }, // 加载资源并解析
    { name: 'my-app2', url: 'xxx', level: 1 }, // 只加载资源
    { name: 'my-app3', url: 'xxx', level: 3 }, // 加载资源、解析并渲染
    { name: 'my-app4', url: 'xxx', level: 3, 'default-page': '/page2' }, // 加载资源、解析并渲染子应用的page2页面
  ],
})

// 方式四：在start中设置一个返回预加载数组的函数
microApp.start({
  preFetchApps: () => [
    { name: 'my-app1', url: 'xxx' }, // 加载资源并解析
    { name: 'my-app2', url: 'xxx', level: 1 }, // 只加载资源
    { name: 'my-app3', url: 'xxx', level: 3 }, // 加载资源、解析并渲染
    { name: 'my-app4', url: 'xxx', level: 3, 'default-page': '/page2' }, // 加载资源、解析并渲染子应用的page2页面
  ],
})

// 设置延迟时间，5秒钟之后执行预加载
microApp.preFetch([
  { name: 'my-app1', url: 'xxx' }, // 加载资源并解析
], 5000)
```

### 插件系统

```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  plugins: {
    // 全局插件，作用于所有子应用的js文件
    global?: Array<{
      // 可选，强隔离的全局变量(默认情况下子应用无法找到的全局变量会兜底到主应用中，scopeProperties可以禁止这种情况)
      scopeProperties?: string[],
      // 可选，可以逃逸到外部的全局变量(escapeProperties中的变量会同时赋值到子应用和外部真实的window上)
      escapeProperties?: string[],
      // 可选，如果函数返回 `true` 则忽略 script 和 link 标签的创建
      excludeChecker?: (url: string) => boolean      // 可选，如果函数返回 `true` ，则 micro-app 不会处理它，元素将原封不动进行渲染
      ignoreChecker?: (url: string) => boolean      // 可选，传递给loader的配置项
      options?: any,
      // 必填，js处理函数，必须返回code值
      loader?: (code: string, url: string, options: any, info: sourceScriptInfo) => code,
      // 可选，html 处理函数，必须返回 code 值
      processHtml?: (code: string, url: string, options: unknown) => code    }>

    // 子应用插件
    modules?: {
      // appName为应用的名称，这些插件只会作用于指定的应用
      [appName: string]: Array<{
        // 可选，强隔离的全局变量(默认情况下子应用无法找到的全局变量会兜底到主应用中，scopeProperties可以禁止这种情况)
        scopeProperties?: string[],
        // 可选，可以逃逸到外部的全局变量(escapeProperties中的变量会同时赋值到子应用和外部真实的window上)
        escapeProperties?: string[],
        // 可选，如果函数返回 `true` 则忽略 script 和 link 标签的创建
        excludeChecker?: (url: string) => boolean        // 可选，如果函数返回 `true` ，则 micro-app 不会处理它，元素将原封不动进行渲染
        ignoreChecker?: (url: string) => boolean        // 可选，传递给loader的配置项
        options?: any,
        // 可选，js处理函数，必须返回code值
        loader?: (code: string, url: string, options: any, info: sourceScriptInfo) => code,
        // 可选，html 处理函数，必须返回 code 值
        processHtml?: (code: string, url: string, options: unknown) => code      }>
    }
  }
})
```

```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  plugins: {
    global: [
      {
        scopeProperties: ['key', 'key', ...], // 可选
        escapeProperties: ['key', 'key', ...], // 可选
        excludeChecker: (url) => ['/foo.js', '/bar.css'].some(item => url.includes(item)), // 可选
        options: 配置项, // 可选
        loader(code, url, options, info) { // 可选
          console.log('全局插件')
          return code        },
        processHtml(code, url, options, info) { // 可选
          console.log('每个子应用 HTML 都会传入')
          return code        },
      }
    ],
    modules: {
      'appName1': [{
        loader(code, url, options, info) {
          if (url === 'xxx.js') {
            code = code.replace('var abc =', 'window.abc =')
          }
          return code        }
      }],
      'appName2': [{
        scopeProperties: ['key', 'key', ...], // 可选
        escapeProperties: ['key', 'key', ...], // 可选
        ignoreChecker: (url) => ['/foo.js', '/bar.css'].some(item => url.includes(item)), // 可选
        options: 配置项, // 可选
        loader(code, url, options, info) { // 可选
          console.log('只适用于appName2的插件')
          return code        },
        processHtml(code, url, options, info) { // 可选
          console.log('只适用于 appName2 的 HTML 处理')
          return code        },
      }]
    }
  }
})
```

### 多层嵌套

```js
microApp.start({
  tagName: 'micro-app-xxx', // 标签名称必须以 `micro-app-` 开头
})

<micro-app-xxx name='xx' url='xx'></micro-app-xxx>

```

### keep-alive

```js
<micro-app name='xx' url='xx' keep-alive></micro-app>
```

### 高级功能

```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  /**   
  * 自定义fetch   
  * @param {string} url 静态资源地址   
  * @param {object} options fetch请求配置项   
  * @param {string|null} appName 应用名称   * @returns Promise<string>  
  */
  fetch (url, options, appName) {
    if (url === 'http://localhost:3001/error.js') {
      // 删除 http://localhost:3001/error.js 的内容
      return Promise.resolve('')
    }
        const config = {
      // fetch 默认不带cookie，如果需要添加cookie需要配置credentials
      credentials: 'include', // 请求时带上cookie
    }

    return window.fetch(url, Object.assign(options, config)).then((res) => {
      return res.text()
    })
  }
})
```










































