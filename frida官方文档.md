## Installation

```bash
pip install frida-tools
```

## Android

```bash
adb root
adb push frida-server /data/local/tmp/
adb shell "chmod 755 /data/local/tmp/frida-server"
adb shell "/data/local/tmp/frida-server &"
adb devices -l
frida-ps -U
```

```bash
frida-trace -U -i open com.android.chrome
```

```bash
frida -U --no-pause -f package_name -l hook_art.js
```

## Java

### Java.available

- 一个布尔值，指示当前进程是否加载了 Java 虚拟机，即 Dalvik 或 ART
- 除非这种情况发生，否则不要调用任何其他 Java 属性或方法

### Java.androidVersion

- 一个字符串，指定我们运行在哪个版本的 Android 上

### Java.enumerateLoadedClasses(callbacks)

- 枚举当前加载的类，
- 其中 callbacks 是一个指定的对象：

1. onMatch(name, handle)
   对每个已加载的类调用，带有可能传递给 use() 以获取 JavaScript 包装的名称。
   您还可以使用 Java.cast() 将句柄转换为 java.lang.Class。
2. onComplete()
   在枚举所有类时调用。

### Java.enumerateLoadedClassesSync()

- enumerateLoadedClasses() 的同步版本
- 返回一个包含类名称的数组。

### Java.enumerateClassLoaders(callbacks)

- 枚举 Java VM 中存在的类加载器
- 其中 callbacks 是一个指定的对象：

1. onMatch(loader)
   对每个类加载器调用，具有 loader，即特定 java.lang.ClassLoader 的包装器。
2. onComplete()
   在枚举所有类加载器时调用。

- 您可以将这样的加载器传递给 Java.ClassFactory.get()，以能够在指定的类加载器上使用类。

### Java.enumerateClassLoadersSync()

- enumerateClassLoaders() 的同步版本，返回一个包含类加载器的数组。

### Java.enumerateMethods(query)

- 枚举与查询匹配的方法，指定为 "class!method"，允许使用通配符。
- 还可以后缀为 / 和一个或多个修饰符：
  i: 不区分大小写匹配。
  s: 包括方法签名，因此例如 "putInt" 变为 "putInt(java.lang.String, int): void"。
  u: 仅用户定义的类，忽略系统类。

```javascript
Java.perform(() => {
  const groups = Java.enumerateMethods('*youtube*!on*')
  console.log(JSON.stringify(groups, null, 2));
});
[
  {
    "loader": "<instance: java.lang.ClassLoader, $className: dalvik.system.PathClassLoader>",
    "classes": [
      {
        "name": "com.google.android.apps.youtube.app.watch.nextgenwatch.ui.NextGenWatchLayout",
        "methods": [
          "onAttachedToWindow",
          "onDetachedFromWindow",
          "onFinishInflate",
          "onInterceptTouchEvent",
          "onLayout",
          "onMeasure",
          "onSizeChanged",
          "onTouchEvent",
          "onViewRemoved"
        ]
      },
      {
        "name": "com.google.android.apps.youtube.app.search.suggest.YouTubeSuggestionProvider",
        "methods": [
          "onCreate"
        ]
      },
      {
        "name": "com.google.android.libraries.youtube.common.ui.YouTubeButton",
        "methods": [
          "onInitializeAccessibilityNodeInfo"
        ]
      },
      …
    ]
  }
]
```

### Java.scheduleOnMainThread(fn)

- 在 VM 的主线程上运行 fn。

### Java.perform(fn)

- 确保当前线程已连接到 VM 并调用 fn。（在来自 Java 的回调中，这不是必需的。）
- 如果应用程序的类加载器尚不可用，将推迟调用 fn。
- 如果不需要访问应用程序的类，则使用 Java.performNow()。

```js
Java.perform(() => {
  const Activity = Java.use("android.app.Activity");
  Activity.onResume.implementation = function () {
    send("onResume() 被调用了！让我们调用原始实现");
    this.onResume();
  };
});
```

### Java.performNow(fn)

- 确保当前线程已连接到 VM 并调用 fn。（在来自 Java 的回调中，这不是必需的。）

### Java.use(className)

- 动态获取 className 的 JavaScript 包装器
- 您可以通过在其上调用 $new() 来实例化对象以调用构造函数
- 在实例上调用 $dispose() 以显式清理它（或等待 JavaScript 对象被垃圾收集，或脚本被卸载）。
- 静态和非静态方法都可用，甚至可以替换方法实现并从中抛出异常：

```js
Java.perform(() => {
  const Activity = Java.use("android.app.Activity");
  const Exception = Java.use("java.lang.Exception");
  Activity.onResume.implementation = function () {
    throw Exception.$new("Oh noes!");
  };
});
```

- 默认情况下使用应用程序的类加载器，但可以通过将不同的加载器实例分配给 Java.classFactory.loader 进行自定义。
- 请注意，所有方法包装器都提供一个 clone(options) API，用于创建具有自定义 NativeFunction 选项的新方法包装器。

### Java.openClassFile(filePath)

- 打开 filePath 处的 .dex 文件，返回一个带有以下方法的对象：

```js
load(); // 将包含的类加载到 VM 中。
getClassNames(); // 获取可用类名称的数组。
```

### Java.choose(className, callbacks)

- 通过扫描 Java 堆，列举类名为 className 的类的实例，其中 callbacks 是一个指定的对象：

```js
onMatch(instance); // 对每个找到的实例调用，带有一个准备就绪的实例，就像您调用了 Java.cast() 与此特定实例的原始句柄一样。此函数可能返回字符串 stop 以提前取消枚举。
onComplete(); // 在枚举所有实例时调用。
```

### Java.retain(obj)

- 为以后在替换方法之外使用而复制 JavaScript 包装器 obj。

```js
Java.perform(() => {
  const Activity = Java.use("android.app.Activity");
  let lastActivity = null;
  Activity.onResume.implementation = function () {
    lastActivity = Java.retain(this);
    this.onResume();
  };
});
```

### Java.cast(handle, klass)

- 根据从 Java.use() 返回的给定类 klass 的现有实例的句柄创建一个 JavaScript 包装器。
- 这样的包装器还具有用于获取其类的包装器的 class 属性，
- 以及用于获取其类名的字符串表示形式的 $className 属性。

```js
const Activity = Java.use("android.app.Activity");
const activity = Java.cast(ptr("0x1234"), Activity);
```

### Java.array(type, elements)

- 使用指定类型的 JavaScript 数组元素创建一个 Java 数组。
- 生成的 Java 数组的行为类似于 JS 数组，但可以通过引用传递给 Java API，以便允许它们修改其内容。

```js
const values = Java.array("int", [1003, 1005, 1007]);
const JString = Java.use("java.lang.String");
const str = JString.$new(Java.array("byte", [0x48, 0x65, 0x69]));
```

### Java.isMainThread()

- 确定调用者是否在主线程上运行。

### Java.registerClass(spec)

- 创建一个新的 Java 类并返回其包装器，其中 spec 是一个包含：

1. name: 指定类名的字符串。
2. superClass: （可选）超类。省略以继承自 java.lang.Object。
3. implements: （可选）由此类实现的接口数组。
4. fields: （可选）指定要公开的每个字段的名称和类型的对象。
5. methods: （可选）指定要实现的方法的对象。

```js
const SomeBaseClass = Java.use("com.example.SomeBaseClass");
const X509TrustManager = Java.use("javax.net.ssl.X509TrustManager");

const MyTrustManager = Java.registerClass({
  name: "com.example.MyTrustManager",
  implements: [X509TrustManager],
  methods: {
    checkClientTrusted(chain, authType) {},
    checkServerTrusted(chain, authType) {},
    getAcceptedIssuers() {
      return [];
    },
  },
});

const MyWeirdTrustManager = Java.registerClass({
  name: "com.example.MyWeirdTrustManager",
  superClass: SomeBaseClass,
  implements: [X509TrustManager],
  fields: {
    description: "java.lang.String",
    limit: "int",
  },
  methods: {
    $init() {
      console.log("Constructor called");
    },
    checkClientTrusted(chain, authType) {
      console.log("checkClientTrusted");
    },
    checkServerTrusted: [
      {
        returnType: "void",
        argumentTypes: [
          "[Ljava.security.cert.X509Certificate;",
          "java.lang.String",
        ],
        implementation(chain, authType) {
          console.log("checkServerTrusted A");
        },
      },
      {
        returnType: "java.util.List",
        argumentTypes: [
          "[Ljava.security.cert.X509Certificate;",
          "java.lang.String",
          "java.lang.String",
        ],
        implementation(chain, authType, host) {
          console.log("checkServerTrusted B");
          return null;
        },
      },
    ],
    getAcceptedIssuers() {
      console.log("getAcceptedIssuers");
      return [];
    },
  },
});
```

### Java.deoptimizeEverything()

- 强制 VM 以其解释器执行所有内容。
- 在某些情况下，这是为了防止优化绕过某些情况中的方法挂钩，并允许使用 ART 的 Instrumentation API 来跟踪运行时。

### Java.deoptimizeBootImage()

- 类似于 Java.deoptimizeEverything()，但仅使引导映像代码失效。
- 与 dalvik.vm.dex2oat-flags --inline-max-code-units=0 一起使用以获得最佳效果。

### Java.vm

- 具有以下方法的对象：

```js
perform(fn); // 确保当前线程已连接到 VM 并调用 fn。在来自 Java 的回调中，这不是必需的。
getEnv(); // 获取当前线程的 JNIEnv 的包装器。如果当前线程未连接到 VM，则抛出异常。
tryGetEnv(); // 尝试获取当前线程的 JNIEnv 的包装器。如果当前线程未连接到 VM，则返回 null。
```

### Java.classFactory

- 用于实现 Java.use() 等的默认类工厂。使用应用程序的主类加载器。

### Java.ClassFactory: 具有以下属性的类：

```js
get(classLoader); // 获取给定类加载器的类工厂实例。在幕后使用的默认类工厂仅与应用程序的主类加载器进行交互。可以通过 Java.enumerateClassLoaders() 发现其他类加载器，并通过此 API 进行交互。
loader; // 只读属性，提供正在使用的类加载器的包装器。对于默认类工厂，这由对 Java.perform() 的第一次调用更新。
cacheDir; // 包含当前正在使用的缓存目录路径的字符串。对于默认类工厂，这由对 Java.perform() 的第一次调用更新。
tempFileNaming; // 指定要用于临时文件的命名约定的对象。默认为 { prefix: 'frida', suffix: 'dat' }。
use(className); // 类似于 Java.use()，但用于特定的类加载器。
openClassFile(filePath); // 类似于 Java.openClassFile()，但用于特定的类加载器。
choose(className, callbacks); // 类似于 Java.choose()，但用于特定的类加载器。
retain(obj); // 类似于 Java.retain()，但用于特定的类加载器。
cast(handle, klass); // 类似于 Java.cast()，但用于特定的类加载器。
array(type, elements); // 类似于 Java.array()，但用于特定的类加载器。
registerClass(spec); // 类似于 Java.registerClass()，但用于特定的类加载器。
```

## frida

- 用法: frida [选项] 目标
- 位置参数:

1. args 额外参数和/或目标

- 选项:

1. -h, --help 显示此帮助消息并退出
2. -D ID, --device ID 连接到具有给定 ID 的设备
3. -U, --usb 连接到 USB 设备
4. -R, --remote 连接到远程 frida-server
5. -H HOST, --host HOST 连接到主机上的远程 frida-server
6. --certificate CERTIFICATE 与主机进行 TLS 通信，期望 CERTIFICATE
7. --origin ORIGIN 使用“Origin”标头连接到远程服务器
8. --token TOKEN 使用 TOKEN 对主机进行身份验证
9. --keepalive-interval INTERVAL 设置保持活动间隔（以秒为单位），或设置为 0 以禁用 （默认为 -1，根据传输自动选择）
10. --p2p 与目标建立对等连接
11. --stun-server ADDRESS 将 STUN 服务器 ADDRESS 与 --p2p 一起使用
12. --relay address,username,password,turn-{udp,tcp,tls} 添加中继以与 --p2p 一起使用
13. -f TARGET, --file TARGET 生成文件 FILE
14. -F, --attach-frontmost 附加到前台应用程序
15. -n NAME, --attach-name NAME 附加到 NAME
16. -N IDENTIFIER, --attach-identifier IDENTIFIER 附加到 IDENTIFIER
17. -p PID, --attach-pid PID 附加到 PID
18. -W PATTERN, --await PATTERN 等待匹配 PATTERN 的生成
19. --stdio {inherit,pipe} 生成时的标准输入/输出行为（默认为“inherit”）
20. --aux option 生成时设置辅助选项，例如“uid=(int)42” （支持的类型有: string, bool, int
21. --realm {native,emulated} 要附加到的领域
22. --runtime {qjs,v8} 要使用的脚本运行时
23. --debug 启用兼容 Node.js 的脚本调试器
24. --squelch-crash 如果启用，将不会将崩溃报告转储到控制台
25. -O FILE, --options-file FILE 包含附加命令行选项的文本文件
26. --version 显示程序的版本号并退出
27. -l SCRIPT, --load SCRIPT 加载 SCRIPT
28. -P PARAMETERS_JSON, --parameters PARAMETERS_JSON 参数以 JSON 形式，与 Gadget 相同
29. -C USER_CMODULE, --cmodule USER_CMODULE 加载 CMODULE
30. --toolchain {any,internal,external} 编译源代码时要使用的 CModule 工具链
31. -c CODESHARE_URI, --codeshare CODESHARE_URI 加载 CODESHARE_URI
32. -e CODE, --eval CODE 评估 CODE
33. -q 安静模式（无提示）并在 -l 和 -e 之后退出
34. -t TIMEOUT, --timeout TIMEOUT 在安静模式下终止前等待的秒数
35. --pause 在生成程序后保持主线程暂停
36. -o LOGFILE, --output LOGFILE 输出到日志文件
37. --eternalize 在退出前永久化脚本
38. --exit-on-error 在 SCRIPT 中遇到任何异常后以代码 1 退出
39. --kill-on-exit Frida 退出时杀死生成的程序
40. --auto-perform 使用 Java.perform 包装输入的代码
41. --auto-reload 启用提供的脚本和 C 模块的自动重新加载（默认启用，将来将是必需的
42. --no-auto-reload 禁用提供的脚本和 C 模块的自动重新加载
