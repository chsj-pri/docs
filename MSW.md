### 概述

Mock Service Worker（MSW）是一个有力的前端开发和测试工具，它提供了模拟和拦截网络请求的能力，从而使开发人员能够更轻松地测试和开发前端应用程序。具有灵活性和可扩展性的主要优点。

### 简单例子

```js
import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

const worker = setupWorker(
  http.get("https://github.com/octocat", ({ request, params, cookies }) => {
    return HttpResponse.json(
      {
        message: "Mocked response",
      },
      {
        status: 202,
        statusText: "Mocked status",
      }
    );
  })
);
worker.start();
```

### Install

```shell
npm install msw --save-dev
```

### Init

将 worker 脚本复制到给定的目录中

```shell
npx msw init <PUBLIC_DIR> [options]
```

**参数 PUBLIC_DIR 表示您应用程序的公共目录的相对路径**

```shell
npx msw init ./public
```

**标志 --save**
将给定的 PUBLIC_DIR 保存在 package.json 中，以便将来自动更新 worker 脚本

```shell
npx msw init ./public --save
```

```js
// 运行此命令将在package.json中保存./public目录：
{
  "name": "my-app",
  "msw": {
    "workerDirectory": "./public"
  }
}
```

### 拦截请求

要为请求发送模拟响应，必须首先拦截该请求，请求拦截是由请求处理程序的函数执行的
如下：

```js
http.get(predicate, resolver);
http.post(predicate, resolver);
```

predicate 字符串|正则表达式，请求路径谓词；
resolver 响应解析器，处理拦截请求的函数

```js
import { http, HttpResponse } from "msw";
http.get("/pets", ({ request, params, cookies }) => {
  return HttpResponse.json(["Tom", "Jerry", "Spike"]);
});
```

### HTTP 请求匹配

1. 请求路径名
   当谓词为字符串时，只有路径名与该字符串匹配的请求才会被拦截，这对相对 URL 和绝对 URL 都适用，
   在提供请求路径名时，请确保排除任何查询参数

```js
export const handlers = [
  http.get("/pets", petsResolver),
  http.post("https://api.github.com/repo", repoResolver),
];
```

```js
// 使用通配符（*）
http.get("/user/*", userResolver);
```

2. 正则表达式

```js
// - DELETE /settings/sessions
// - DELETE /settings/messages
http.delete(/\/settings\/(sessions|messages)/, resolver);
```

### 响应请求

```js
import { http } from "msw";
export const handlers = [
  // 拦截/resource请求
  http.get("/resource", () => {
    // 并响应一个“text/plain”响应，带有“Hello world!”文本响应正文
    return new Response("Hello world!");
  }),
];
```

_不需要导入 Response 类，它是浏览器内置类_

### 使用 HttpResponse 类

_建议使用库提供的 HttpResponse 类，功能更强大，使用更简洁_

```js
import { http, HttpResponse } from "msw";
export const handlers = [
  http.get("/resource", () => {
    return HttpResponse.text("Hello world!");
  }),
];
```

### 模拟状态代码

_使用 status 和或 statusText 属性来指定模拟响应的状态_

```js
import { http, HttpResponse } from "msw";
export const handlers = [
  http.get("/apples", () => {
    return new HttpResponse(null, {
      status: 404,
      statusText: "Out Of Apples",
    });
  }),
];
```

### 模拟标头

```js
import { http, HttpResponse } from "msw";
export const handlers = [
  http.post("/auth", () => {
    return new HttpResponse(null, {
      headers: {
        "Set-Cookie": "mySecret=abc-123",
        "X-Custom-Header": "yes",
      },
    });
  }),
];
```

### 文本响应

```js
import { http, HttpResponse } from "msw";
export const handler = [
  http.get("/name", () => {
    return new HttpResponse("John");
  }),
];
```

### JSON 响应

```js
import { http, HttpResponse } from "msw";
export const handlers = [
  http.post("/auth", () => {
    return HttpResponse.json({
      user: {
        id: "abc-123",
        name: "John Maverick",
      },
    });
  }),
];
```

### 流式响应

```js
import { http, HttpResponse } from "msw";
const encoder = new TextEncoder();
export const handlers = [
  http.get("/video", () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("Brand"));
        controller.enqueue(encoder.encode("New"));
        controller.enqueue(encoder.encode("World"));
        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }),
];
```

### XML 响应

```js
HttpResponse.xml(`
<post>
  <id>abc-123</id>
  <title>Modern Testing Practices</title>
</post>
`);
```

### FormData 响应

```js
const form = new FormData();
form.append("id", "abc-123");
form.append("title", "Modern Testing Practices");
HttpResponse.formData(form);
```

### ArrayBuffer 响应

```js
HttpResponse.arrayBuffer(buffer, {
  headers: {
    "Content-Type": "application/octet-stream",
  },
});
```

### 模拟错误响应

```js
http.get("/user", () => {
  return new HttpResponse(null, { status: 401 });
});
```

### 模拟网络错误

```js
http.post("/checkout/cart", () => {
  return HttpResponse.error();
});
```

### 读取请求体

```js
// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
const allPosts = new Map();

export const handlers = [
  http.post("/posts", async ({ request }) => {
    // 以JSON格式读取拦截的请求主体
    const newPost = await request.json();

    // 将新帖子添加到所有帖子的映射中
    allPosts.set(newPost.id, newPost);

    // 声明一个语义上的“201已创建”
    // 响应并返回新创建的帖子！
    return HttpResponse.json(newPost, { status: 201 });
  }),
];
```

### 读取路径参数

```js
// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
const allPosts = new Map();

export const handlers = [
  http.delete("/posts/:id", ({ params }) => {
    // 所有请求路径参数都提供在“params”中
    // 响应解析器的参数中
    const { id } = params;

    // 让我们尝试通过其ID获取帖子
    const deletedPost = allPosts.get(id);

    // 如果给定的帖子ID不存在，则回复“404未找到”响应
    if (!deletedPost) {
      return new HttpResponse(null, { status: 404 });
    }

    // 从“allPosts”映射中删除帖子
    allPosts.delete(id);

    // 回复“200 OK”响应和删除的帖子
    return HttpResponse.json(deletedPost);
  }),
];
```

### 读取 cookies

```js
http.get("/user", ({ cookies }) => {
  const { session } = cookies;
  if (!session) {
    return new HttpResponse(null, { status: 401 });
  }
});
```

### 透传请求

```js
import { http, passthrough } from "msw";
export const handlers = [
  http.get("/user", () => {
    return passthrough();
  }),
];
```

### 浏览器集成

将 MSW 集成到浏览器中允许您在浏览器中设置请求拦截
以下是将 MSW 集成到浏览器中的步骤：

1. **复制 Worker 脚本：**
   - 使用 MSW CLI 的 `init` 命令将 `./mockServiceWorker.js`（这个脚本允许 MSW 拦截网络请求） Worker 脚本复制到应用程序的公共目录，将 `<PUBLIC_DIR>` 替换为项目的公共目录
   ```
   npx msw init /public
   ```
2. **设置 Worker 配置：**
   - 在项目的 mocks 目录中创建一个 JavaScript 模块文件（例如 `browser.js`）
   - 在该模块中，从 `msw/browser` 导入 `setupWorker` ，从 `./handlers` 导入请求处理程序，使用`setupWorker` 创建一个 Worker 实例
   ```javascript
   // src/mocks/browser.js
   import { setupWorker } from "msw/browser";
   import { handlers } from "./handlers";
   export const worker = setupWorker(...handlers);
   ```
3. **启用 Mock：**

   - 调用`worker.start()`启动 Worker，将注册并激活 Service Worker。只在开发环境中启用 API 模拟，以确保生产流量不受影响
   - 由于注册 Service Worker 是一个异步操作，建议在注册 Promise 解决之前推迟应用程序的渲染

   ```javascript
   // src/index.jsx
   import React from "react";
   import ReactDOM from "react-dom";
   import { App } from "./App";

   async function deferRender() {
     if (process.env.NODE_ENV === "development") {
       const { worker } = await import("./mocks/browser");
       // `worker.start()`返回一个 Promise
       return worker.start();
     }
   }

   // 请确保等待 `worker.start()` Promise！Service Worker 注册是异步的，不等待它可能导致 Service Worker 注册与应用程序发出的初始请求之间发生竞争条件
   deferRender().then(() => {
     ReactDOM.render(<App />, rootElement);
   });
   ```

4. **确认：**
   - 在浏览器中打开控制台，如果集成成功，将看到以下消息被打印出来：
   ```
   [MSW] Mocking enabled.
   ```

### setupWorker

```js
import { setupWorker } from "msw/browser";
const worker = setupWorker(); // 当没有提供任何参数调用时，返回一个没有网络描述的 Worker 实例
worker.start();
worker.use(...handlers); // 使用 worker.use() 和 worker.resetHandlers() 等方法将运行时请求处理程序添加到 worker 实例中
```

### worker.start

注册 Service Worker 并开始请求拦截
接受一个可选的 Options 对象，可以用于自定义 worker 注册
返回一个 promise

```js
worker.start({
  serviceWorker: {
    url: "/assets/mockServiceWorker.js", // 自定义worker脚本
    options: {
      // 缩小 worker 可以控制的页面范围
      scope: "/product",
      quiet: true, // 禁用库的所有日志记录，默认true
    },
    onUnhandledRequest(request, print) {
      // 决定如何处理未处理的请求（即没有匹配的请求处理程序的请求）
      // 忽略包含 URL 中的 "cdn.com" 的任何请求
      if (request.url.includes("cdn.com")) {
        return;
      }
      // 否则，打印未处理的请求警告
      print.warning();
    },
  },
});
```

### worker.stop

停止对当前客户端的请求拦截
函数不接受任何参数，并且不返回任何内容

```js
// mocks/browser.js
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
export const worker = setupWorker(...handlers);
// 在全局范围内公开worker实例，可在控制台调用window.worker.stop()来停止请求拦截
window.worker = worker;
worker.stop();
```

### worker.use

在当前 worker 实例前添加请求处理程序

```js
import { http } from "msw";
import { worker } from "./mocks/browser";
import { handlers } from "./handlers";
// 将一系列新处理程序前置到这个worker实例中
worker.use(http.get("/resource"), http.post("/resource"));
worker.use(...handlers);
```

### worker.resetHandlers

重置请求处理程序为初始列表

```js
const worker = setupWorker(http.get("/resource", resolver));
worker.use(http.post("/user", resolver));

// 移除所有运行时请求处理程序（通过worker.use()添加的处理程序）
// "POST /user" 运行时请求处理程序被移除
// 只剩下初始 "GET /resource" 请求处理程序
worker.resetHandlers();
```

```js
const worker = setupWorker(http.get("/resource", resolver));
worker.use(http.post("/user", resolver));

// "POST /user" 运行时请求处理程序和初始 "GET /resource" 请求处理程序都被移除
// 只剩下 "PATCH /book/:bookId" 请求处理程序
worker.resetHandlers(http.patch("/book/:bookId", resolver));
```

### worker.restoreHandlers

将已使用的一次性请求处理程序标记为未使用

```js
const worker = setupWorker(
  http.get("/resource", () => HttpResponse.json({ id: "abc-123" }), {
    once: true,
  })
);

// 第一次请求 "GET /resource" 将被上述请求处理程序拦截，并返回模拟的 JSON 响应
await fetch("/resource");

// 由于上述匹配的请求处理程序被标记为 "{ once: true }"，
// 并且已经处理了匹配的请求，所以对这个资源的后续请求将被绕过，
// 并返回原始响应。
await fetch("/resource");

// 通过调用 "worker.restoreHandlers()" 方法，您可以将所有已使用的一次性请求处理程序标记为未使用，以便它们可以再次影响网络。
worker.restoreHandlers();

// 匹配的一次性请求处理程序已恢复，因此将再次返回模拟的响应。
// 从这一点开始，处理程序被标记为已使用。
await fetch("/resource");
```

### worker.listHandlers

返回当前请求处理程序的列表

```js
worker.listHandlers(); // 返回Array<RequestHandler>
```

### http

创建请求处理程序来拦截 HTTP 请求

```js
http.get<PathParams, RequestBodyType, ResponseBodyType>(
  predicate: string | RegExp,
  resolver: ResponseResolver<
    HttpRequestResolverExtras<Params>,
    RequestBodyType,
    ResponseBodyType
  >,
  options?: RequestHandlerOptions
)
```

### http.get

```js
http.get("/user/:id", ({ params }) => {
  const { id } = params;
  console.log('获取ID为 "%s" 的用户', id);
});
```

### http.head

```js
http.head("/resource", () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": 1270,
      "Last-Modified": "Mon, 13 Jul 2020 15:00:00 GMT",
    },
  });
});
```

### http.post

```js
http.post("/login", async ({ request }) => {
  const info = await request.formData();
  console.log('以 "%s" 登录', info.get("username"));
});
```

### http.put

```js
http.put("/post/:id", async ({ request, params }) => {
  const { id } = params;
  const nextPost = await request.json();
  console.log('更新帖子 "%s" 为:', id, nextPost);
});
```

### http.patch

```js
http.patch("/cart/:cartId/order/:orderId", async ({ request, params }) => {
  const { cartId, orderId } = params;
  const orderUpdates = await request.json();

  console.log('更新购物车 "%s" 中的订单 "%s":', orderId, cartId, orderUpdates);
});
```

### http.delete

```js
http.delete("/user/:id", ({ params }) => {
  const { id } = params;
  console.log('删除ID为 "%s" 的用户', id);
});
```

### http.options

```js
http.options("https://api.example.com", () => {
  return new Response(null, {
    status: 200,
    headers: {
      Allow: "GET,HEAD,POST",
    },
  });
});
```

### http.all

创建一个请求处理程序，拦截到给定端点的任何请求

```js
import { http } from "msw";
export const handlers = [
  // 此处理程序将捕获 "/user" 端点的所有请求：GET、POST、DELETE等。
  http.all("/user", () => {
    // 处理请求。
  }),
];
```

### 响应解析器参数

- request：整个请求的引用
- params：请求的路径参数
- cookies：请求的 cookies

```js
http.get("/user/:id", ({ request, params, cookies }) => {});
```

### 处理程序选项

所有方法都接受一个可选的第三个参数，表示请求处理程序选项

```js
http.get("/greeting", () => HttpResponse.text("Hello world"), {
  // 首次成功匹配后为已使用。已使用的请求拦截期间将被忽略
  // 使用restoreHandlers()方法将请求处理程序标记为未使用
  once: true,
});
```

### HttpResponse

```js
class HttpResponse {
  constructor(
    body:
      | Blob
      | ArrayBuffer
      | TypedArray
      | DateView
      | FormData
      | ReadableStream
      | URLSearchParams
      | string
      | null
      | undefined
    options?: {
      status?: number
      statusText?: string
      headers?: HeadersInit
    }
  )
}
```

### new HttpResponse(body, init)

使用给定的响应主体和选项构造一个新的 Response 实例

```js
const response = new HttpResponse("Hello world!");
```

```js
// 这与"new Response()"是等价的
new HttpResponse("Not found", {
  status: 404,
  headers: {
    "Content-Type": "text/plain",
  },
});
```

### HttpResponse.json(body, init)

使用 JSON 主体创建一个新的响应的静态方法

```js
http.get("/resource", () => {
  // 这与"Response.json(body)"是等价的。
  return HttpResponse.json({
    id: "abc-123",
    title: "现代化的测试实践",
  });
});
```

### HttpResponse.error()

创建一个新的网络错误响应实例的静态方法

```js
http.get("/resource", () => {
  // 这与"Response.error()"是等价的
  return HttpResponse.error();
});
```

### HttpResponse.text(body, init)

使用 Content-Type: text/plain 头和给定的响应主体创建一个 Response 实例

```js
HttpResponse.text("Hello world!");
```

### HttpResponse.xml(body, init)

使用 Content-Type: application/xml 头和给定的响应主体创建一个 Response 实例

```js
HttpResponse.xml(`
<post>
  <id>abc-123</id>
  <title>现代化的测试实践</title>
</post>
`);
```

### HttpResponse.formData(body, init)

使用 Content-Type: multipart/form-data 头和给定的响应主体创建一个 Response 实例

```js
const form = new FormData();
form.append("id", "abc-123");
form.append("title", "现代化的测试实践");
HttpResponse.formData(form);
```

### HttpResponse.arrayBuffer(body, init)

使用给定的 ArrayBuffer 主体创建一个新的 Response 实例
根据缓冲区的字节长度自动设置 Content-Length 响应头
不设置任何其他头，如 Content-Type

```js
HttpResponse.arrayBuffer(buffer, {
  headers: {
    "Content-Type": "application/octet-stream",
  },
});
```

### 延迟 delay

控制响应的时间

```js
function delay(duration?: number): Promise<void> {}
function delay(mode?: "real" | "infinite"): Promise<void> {}
```

### 隐式延迟

当没有提供任何参数时，delay 会使用一个真实的服务器响应时间，它是一个随机数，等于与实际 HTTP 服务器通信时遇到的平均响应时间（约 100-400 毫秒）

```js
import { http, delay, HttpResponse } from "msw";
export const handlers = [
  http.put("/books/:bookId", async () => {
    // 等待一个随机的真实服务器响应时间
    await delay();
    return HttpResponse.json({ id: "abc-123" });
  }),
];
```

### 显式延迟

可以提供精确的延迟持续时间（以毫秒为单位）

```js
import { http, delay, HttpResponse } from "msw";
export const handlers = [
  http.get("/user", async () => {
    // 在响应之前等待1000毫秒
    await delay(1000);
    return new HttpResponse(null, { status: 404 });
  }),
];
```

```js
// 在模拟响应流时，控制精确的延迟时间
import { http, delay, HttpResponse } from "msw";
export const handlers = [
  http.get("/video", () => {
    const stream = new ReadableStream({
      async start() {
        controller.enqueue(new Uint8Array([1, 2, 3]));
        await delay(1000);

        controller.enqueue(new Uint8Array([4, 5, 6]));
        await delay(200);

        controller.enqueue(new Uint8Array([7, 8, 9]));
        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  }),
];
```

### 延迟模式

delay 函数接受一个字符串，表示延迟模式的枚举

- real 显式设置真实的响应时间
- infinite 无限延迟响应，使其永远挂起，通过使用 infinite 模式测试应用程序如何处理响应超时

```js
import { http, delay } from "msw";
export const handlers = [
  http.get("/book/:bookId", async () => {
    // 这个请求将无限期挂起
    await delay("infinite");
    // 并且这个响应将永远不会发送
    return new Response();
  }),
];
```

### bypass

这个方法旨在在库的拦截算法之外执行 HTTP 请求
通过 bypass 执行的请求将永远不会被拦截，即使网络描述中存在匹配的请求处理程序
这种特殊的行为可以实现更复杂的网络场景，比如响应修补：

```js
function bypass(
  input: RequestInput,
  init?: RequestInit
): [RequestInput, RequestInit | undefined] {}
```

```js
import { http, bypass, HttpResponse } from "msw";
export const handlers = [
  http.get("/user", async ({ request }) => {
    // 通过将其"request"引用传递给"bypass"函数，按原样执行被拦截的"GET /user"请求
    const response = await fetch(...bypass(request));
    const realUser = await response.json();

    // 通过修补原始响应和模拟数据，返回一个模拟的JSON响应
    return HttpResponse.json({
      ...realUser,
      lastName: "Maverick",
    });
  }),
];
```

### passthrough

按原样处理拦截的请求

```js
function passthrough(): Response {}
```

```js
import { http, passthrough, HttpResponse } from "msw";
export const handlers = [
  http.get("/resource", ({ request }) => {
    if (request.headers.has("x-my-header")) {
      return passthrough();
    }
    return HttpResponse.text("模拟响应");
  }),
];
```

### RequestHandler

用于创建自定义请求处理程序

```js
import { RequestHandler } from "msw";
export class CustomRequestHandler extends RequestHandler {
  constructor() {
    super(args);
  }
}
```

**args 对象：**

| 参数名称 | 类型 | 描述                       |
| -------- | ---- | -------------------------- |
| info     | 对象 | 请求处理程序信息对象       |
| resolver | 函数 | 处理匹配请求的响应解析函数 |
| options  | 对象 | 可选，请求处理程序选项     |

**请求处理程序选项：**

- once 可选，布尔值，当设置为 true 时，标记此请求处理程序在第一次之后不活动

**属性 info 对象：**

- 有关此请求处理程序的信息对象
- header 字符串 此请求处理程序的公共字符串表示形式

```js
class MyHandler extends RequestHandler {
  constructor(method, path, resolver) {
    super({
      info: {
        // 此请求处理程序的公共表示形式。
        // 在使用“.log()”方法记录处理程序时将使用此字符串。
        header: `${method} ${path}`,
        // 从此自定义处理程序的构造函数参数转发的其他信息属性。
        method,
        path,
      },
      resolver,
    });
  }
}

const handler = new MyHandler("GET", "/user");
console.log(handler.info.method); // "GET"
console.log(handler.info.path); // "/user"
```

### RequestHandler.parse(args)

解析拦截的请求以提取进一步请求处理程序阶段的附加信息

| 参数名称 | 类型    | 描述           |
| -------- | ------- | -------------- |
| request  | Request | 拦截的请求实例 |
| context  | 对象    | 请求解析上下文 |

### RequestHandler.extendResolverArgs(args)

扩展响应解析器参数对象，方法返回的任何对象都会与默认的响应解析器参数对象进行浅合并

| 参数名称     | 类型    | 描述                     |
| ------------ | ------- | ------------------------ |
| request      | Request | 拦截的请求实例           |
| parsedResult | 对象    | 从 parse()方法返回的对象 |
| context      | 对象    | 请求解析上下文           |

### RequestHandler.predicate(args)

决定是否由此请求处理程序处理拦截的请求。predicate()方法应返回一个布尔值

| 参数名称     | 类型    | 描述                     |
| ------------ | ------- | ------------------------ |
| request      | Request | 拦截的请求实例           |
| parsedResult | 对象    | 从 parse()方法返回的对象 |
| context      | 对象    | 请求解析上下文           |

### RequestHandler.log(args)

每当此请求处理程序处理拦截的请求时，打印浏览器控制台消息

| 参数名称     | 类型     | 描述                       |
| ------------ | -------- | -------------------------- |
| request      | Request  | 拦截的请求实例             |
| response     | Response | 从解析器函数返回的响应实例 |
| parsedResult | 对象     | 从 parse()方法返回的对象   |

### 请求阶段

当 MSW 拦截一个请求时，将其传递给请求处理程序，请求处理程序将按照以下顺序处理请求中的阶段：

**阶段 1：解析（parse）**
首先，将使用请求处理程序的 parse()方法解析拦截的请求实例
解析阶段的目的是从请求中提取其他信息

```js
// SearchParamsHandler.js
import { RequestHandler } from "msw";
export class SearchParamsHandler extends RequestHandler {
  constructor(expectedParams, resolver) {
    super({
      info: { header: JSON.stringify(expectedParams) },
      resolver,
    });
    this.expectedParams = expectedParams;
  }

  parse({ request }) {
    // 从拦截的请求URL中提取搜索参数
    const searchParams = new URL(request.url).searchParams;

    // 将搜索参数暴露给其他处理程序的方法
    return {
      searchParams,
    };
  }
}
```

**阶段 2：谓词（predicate）**
确定是否应该由此请求处理程序处理拦截的请求
将拦截的请求实例和从 parse()方法返回的解析结果传递给请求处理程序的 predicate()方法
谓词方法必须返回一个布尔值，指示是否应该由此处理程序处理拦截的请求

```js
// SearchParamsHandler.js
import { RequestHandler } from "msw";
export class SearchParamsHandler extends RequestHandler {
  constructor(expectedParams, resolver) {
    super({
      info: { header: JSON.stringify(expectedParams) },
      resolver,
    });
    this.expectedParams = expectedParams;
  }

  parse({ request }) {
    const searchParams = new URL(request.url).searchParams;
    return {
      searchParams,
    };
  }

  predicate({ request, parsedResult }) {
    const { searchParams } = parsedResult;
    // 遍历期望的搜索参数
    // 确保实际请求与它们匹配
    for (const [expectedParamName, expectedParamValue] of Object.entries(
      this.expectedParams
    )) {
      if (searchParams.get(expectedParamName) !== expectedParamValue) {
        return false;
      }
    }

    return true;
  }
}
```

**阶段 3：解决（resolver）**
请求处理程序在谓词阶段返回 true，则开始解决阶段
父级 RequestHandler 类通过使用请求实例和从 extendResolverArgs()方法返回的任何其他信息执行提供的 resolver 函数来处理请求解析
从解析器函数返回的响应将传播到 MSW，并应用于请求

```js
// SearchParamsHandler.js
import { RequestHandler } from "msw";
export class SearchParamsHandler extends RequestHandler {
  constructor(expectedParams, resolver) {
    super({
      info: { header: JSON.stringify(expectedParams) },
      resolver,
    });
  }

  parse({ request }) {
    const searchParams = new URL(request.url).searchParams;
    return {
      searchParams,
    };
  }

  predicate({ request, parsedResult }) {
    /* 在这里进行搜索参数谓词 */
  }

  extendResolverArgs({ request, parsedResult }) {
    return {
      searchParams: parsedResult.searchParams,
    };
  }
}
```

```js
// handlers.js
import { HttpResponse } from "msw";
import { SearchParamsHandler } from "./SearchParamsHandler";
export const handlers = [
  new SearchParamsHandler({ id: "abc-123" }, ({ request, searchParams }) => {
    // 自定义请求处理程序公开了对拦截请求的"URLSearchParams"实例的引用
    // 因此我们可以在解析器中直接操作它
    const id = searchParams.get("id");
    return HttpResponse.json({ id });
  }),
];
```

### 生命周期事件

允许您订阅在请求/响应处理过程中发生的内部库事件
在使用 MSW 进行开发或测试时，您不太可能直接使用此 API
然而，在以下情况下，此 API 可能会有益处：

- 当您构建封装 MSW 的第三方库时
- 当您希望在应用程序中透明地监视请求/响应时
- 当您希望明确等待特定请求/响应时

> 注意事项:
> 生命周期事件 API 是只读的。这意味着您可以观察请求和响应，但无法对其产生影响。如果您希望影响请求处理，请考虑使用 setupWorker

### 在读取之前进行克隆

通过此 API 公开的请求和响应引用是发生的请求和收到的响应的确切 Fetch API 表示。如果您希望读取它们的主体，请不要忘记对它们进行克隆

```js
worker.events.on("request:start", async ({ request }) => {
  // 为应用程序中发生的每个请求，将请求主体作为文本读取
  const payload = await request.clone().text();
});
```

> 还可以在 events 对象上使用 addListener()、once()和 removeListener()等方法

```js
// 观察应用程序中的所有发出的请求
server.events.on("request:start", ({ request, requestId }) => {
  console.log("发出的请求:", request.method, request.url);
});
```

### 请求事件

**request:start**
当应用程序发生请求时，会触发 request:start 事件
您可以在监听器的参数中访问请求引用

```js
worker.events.on("request:start", ({ request, requestId }) => {
  console.log("发出的请求:", request.method, request.url);
});
```

**request:match**
当拦截的请求具有对应的请求处理程序定义时，会触发 request:match 事件

**request:unhandled**
当拦截的请求没有对应的请求处理程序定义，将按原样执行时，会触发 request:unhandled 事件

**request:end**
当请求结束时，会触发 request:end 事件
无论请求是否被处理，此事件都会触发

### 响应事件

**response:mocked**
当发送模拟响应时，会触发 response:mocked 事件
您可以在此事件的监听器中访问响应引用和相应的请求引用

```js
server.events.on("response:mocked", ({ request, requestId, response }) => {
  console.log(
    "收到%s %s 的响应：%s %s",
    request.method,
    request.url,
    response.status,
    response.statusText
  );
});
```

**response:bypass**
当发送原始（绕过的）响应时，会触发 response:bypass 事件
与 response:mocked 事件类似，您可以在监听器中访问响应和请求引用

### 最佳实践-处理程序结构

我们建议利用一个单独的 handlers.js 模块来描述网络的成功状态（正常情况）
始终从成功行为开始，您始终有一个基本的请求处理，以及您可能添加的任何运行时覆盖。

复杂的系统可能具有复杂的 API
在模拟它们时，这种复杂性可能导致同时存在大量的请求处理程序
以下是如何处理大型网络描述的几种方式

**分组请求处理程序**
同一资源的所有服务器端行为不必存在于单个请求处理程序中，
不同区域的所有网络描述也不必写在单个 handlers 数组中

```
mocks/
  handlers/
    user.js
    checkout.js
    index.js
```

```js
// mocks/handlers/user.js
import { http } from "msw";
// 这些请求处理程序关注与用户相关的端点。
export const handlers = [
  http.get("/user", getUserResolver),
  http.post("/login", loginResolver),
  http.delete("/user/:userId", deleteUserResolver),
];
```

```js
// mocks/handlers/index.js
import { handlers as userHandlers } from "./user";
import { handlers as checkoutHandlers } from "./checkout";
// 根级别的请求处理程序将所有基于域的处理程序组合成一个网络描述数组
export const handlers = [...userHandlers, ...checkoutHandlers];
```

**抽象重复逻辑**
将重复逻辑抽象到实用函数中，然后可以在不同的请求处理程序中重复使用这些函数

```js
import { http } from "msw";
import { utilOne, utilTwo } from "./utils";

export const handlers = [
  http.get("/user", async ({ request }) => {
    const result = await utilOne(request);
  }),
  http.post("/login", () => {
    utilTwo();
  }),
];
```

```js
import { http, HttpResponse } from "msw";
import { withAuth } from "./withAuth";
export const handlers = [
  http.get("/cart", withAuth(getCartResolver)),
  http.post("/checkout/:cartId", withAuth(addToCartResolver)),
];
```

### 参考

- https://zhuanlan.zhihu.com/p/638887405
- https://editor.swagger.io/
