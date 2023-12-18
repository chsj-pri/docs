### 安装

```bash
pip install frida
adb devices

adb push /Users/用户名/Desktop/frida-server-10.7.7-android-arm data/local/tmp/frida-server

adb shell
su
cd  /data/local/tmp
chmod 755 frida-server
./frida-server

frida-ps -U
# -U 代表着 USB，并且让 Frida 检查 USB-Device 真机，出现图上这样就是成功了
frida-ps -U | grep xhs

frida -U -f com.xingin.xhs -l ./frida-script/xhs-main.js
```

### 常用 API

1. Java.perform(fn)
   frida 的 main，注意：所有的脚本必须放在这里面，示例：
2. Java.use(className)
   动态获取一个类的对象，为以后改变对象方法的实现，或者用$new()实例化对象， $dispose()销毁对象

```js
Java.perform(function () {
    var Activity = Java.use(“android.app.Activity”);//获得类包相当于js的new()
    Activity.onResume.implementation = function () {//改变onResume函数
         	send("onResume() got called! Let's call the original implementation”);
         this.onResume();
    };
});
```

```js
Java.perform(function () {
    var Activity = Java.use("android.app.Activity");
    var Exception = Java.use("java.lang.Exception");
    Activity.onResume.implementation = function () {
        throw Exception.$new(“Hello World!");
    };
});
```

3. Java.enumerateLoadedClasses(callbacks)
   列出当前已经加载的类，用回调函数处理
   回调函数 onMatch:function(className){ }
   找到加载的每个类的时候被调用，参数就是类的名字，这个参数可以传给 java.use()来获得一个 js 类包
   回调函数 onComplete: function ()
   列出所有类之后被调用

4. Interceptor.attach(target, callbacks)
   在 target 指定的位置进行函数调用拦截，target 是一个 NativePointer 参数，用来指定你想要拦截的函数的地址。callbacks 参数是一个对象：
   onEnter: function(args): 被拦截函数调用之前回调，其中原始函数的 参数使用 args 数组（NativePointer 对象数组）来表示，可以在这里修改函数的调用参数。
   onLeave: function(retval): 被拦截函数调用之后回调，其中 retval 表示原始函数的返回值，retval 是从 NativePointer 继承来的，是对原始返回值的一个封装，可以使用 retval.replace(1337)调用来修改返回值的内容。注意：retval 对象只在 onLeave 函数作用域范围内有效，因此如果你要保存这个对象以备后续使用的话，一定要使用深拷贝来保存对象，比如：ptr(retval.toString())
   示例：

```js
Interceptor.attach(Module.findExportByName(“libc.so”,”read”),{
	onEnter:function(args){
		this.fileDescriptor = args[0].toInt32();
	},
	onLeave:function(retval){
		if(retval.toInt32( ) > 0){
			/* do something with this.fileDescriptor */
		}
	}
});
```

5. Interceptor.detachAll()
   取消之前所有的拦截调用
6. Interceptor.replace(target, replacement):
   函数实现代码替换，注意：这种情况主要用于想要完全替换掉一个原有函数的实现，replacement 参数使用 JavaScript 形式的一个 NativeCallback 来实现，后续如果想要取消这个替换效果，可以使用 Interceptor.revert 调用来实现

### 测试脚本

```js
// s1.js
function main() {
  Java.perform(function x() {
    console.log("sakura");
  });
}
setImmediate(main);
```

```python
loader.py

import time
import frida

device8 = frida.get_device_manager().add_remote_device("192.168.0.9:8888")
pid = device8.spawn("com.android.settings")
device8.resume(pid)
time.sleep(1)
session = device8.attach(pid)
with open("si.js") as f:
    script = session.create_script(f.read())
script.load()
input() #等待输入
# 解释一下，这个脚本就是先通过frida.get_device_manager().add_remote_device来找到device,然后spawn方式启动settings，然后attach到上面，并执行frida脚本。
```

### frida 查看当前存在的进程

```bash
frida-ps -U #查看通过 usb 连接的 android 手机上的进程
frida-ps -U | grep xhs
```

### 打印参数和修改返回值

```js
function main() {
  console.log("Enter the Script!");
  Java.perform(function x() {
    console.log("Inside Java perform");
    var MainActivity = Java.use(
      "myapplication.example.com.frida_demo.MainActivity"
    );
    // 重载找到指定的函数
    MainActivity.fun.overload("java.lang.String").implementation = function (
      str
    ) {
      //打印参数
      console.log("original call : str:" + str);
      //修改结果
      var ret_value = "sakura";
      return ret_value;
    };
    ``;
  });
}
setImmediate(main);
```

```bash
frida-ps -U | grep frida
# 8738  frida-helper-32
# 8897  myapplication.example.com.frida_demo

# -f是通过spawn，也就是重启apk注入js
frida -U -f myapplication.example.com.frida_demo -l frida_demo.js
# original call : str:LoWeRcAsE Me!!!!!!!!!
# 12-21 04:46:49.875 9594-9594/myapplication.example.com.frida_demo D/sakura.string: sakura
```
