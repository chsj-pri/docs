## 开发教程

### Xposed 的工作原理

在开始修改之前，你应该对 Xposed 的工作原理有一个大致的了解（如果感到太无聊，你可以跳过这一部分）。这是 Xposed 的工作原理：

有一个称为“Zygote”的进程。这是 Android 运行时的核心。每个应用程序都是作为它的一个副本（“fork”）启动的。当手机启动时，这个过程由一个/init.rc 脚本启动。进程的启动是通过/system/bin/app_process 完成的，它加载所需的类并调用初始化方法。

这就是 Xposed 登场的地方。当你安装框架时，会将一个扩展的 app_process 可执行文件复制到/system/bin。这个扩展的启动过程在类路径中添加了一个额外的 jar，并在特定位置调用其中的方法。例如，在 VM 创建后不久，甚至在 Zygote 的主方法被调用之前。而在该方法内部，我们是 Zygote 的一部分，可以在其上下文中执行操作。

该 jar 位于/data/data/de.robv.android.xposed.installer/bin/XposedBridge.jar，并且其源代码可以在这里找到。查看类[XposedBridge](https://github.com/rovo89/XposedBridge/blob/master/src/de/robv/android/xposed/XposedBridge.java)，你可以看到主方法。这就是我上面说的，在进程的最开始被调用的地方。在那里进行一些初始化，还加载模块（稍后我会回到模块加载）。

方法挂钩/替换
Xposed 真正强大的地方在于“挂钩”方法调用的可能性。当你通过反编译 APK 进行修改时，可以直接在任何位置插入/更改命令。但是，之后你需要重新编译/签名 APK，而且只能分发整个包。通过 Xposed，你可以放置挂钩，而无法修改方法内部的代码（在哪里进行什么样的更改是无法明确定义的）。相反，你可以在方法之前和之后注入自己的代码，方法是 Java 中可以清晰定位的最小单元。

XposedBridge 有一个私有的本地方法 hookMethodNative。这个方法在扩展的 app_process 中也实现了。它将方法类型更改为“本地”，并将方法实现链接到它自己的本地通用方法。这意味着每次调用挂钩方法时，通用方法将被调用，而调用方不知道。在此方法中，XposedBridge 中的方法 handleHookedMethod 被调用，将方法调用的参数、this 引用等传递给方法。然后，该方法负责调用为该方法调用注册的回调。这些回调可以更改调用的参数，更改实例/静态变量，调用其他方法，对结果进行操作...或者跳过其中的任何操作。这非常灵活。

好了，理论够了。现在让我们创建一个模块吧！

# 创建项目

一个模块就是一个普通的应用，只不过带有一些特殊的元数据和文件。因此，首先创建一个新的 Android 项目。我假设你以前已经做过这个。如果没有，[官方文档](http://developer.android.com/sdk/installing.html)非常详细。当要求选择 SDK 时，我选择了 4.0.3（API 15）。我建议你也尝试一下，暂时不要进行实验。由于修改没有任何用户界面，所以不需要创建活动。回答完这个问题后，你应该有一个空白的项目。

# 使项目成为 Xposed 模块

现在让我们将项目转变为 Xposed 加载的东西，一个模块。为此，需要执行以下几个步骤。

## 将 Xposed Framework API 添加到项目中

你可以在[使用 Xposed Framework API](https://github.com/rovo89/XposedBridge/wiki/Using-the-Xposed-Framework-API)中找到所需的步骤。确保记住 API 版本，在下一步中会用到。

## AndroidManifest.xml

Xposed Installer 中的模块列表会查找带有特殊元数据标志的应用程序。你可以通过进入 AndroidManifest.xml => Application => Application Nodes（底部） => Add => Meta Data 来创建它。名称应为 xposedmodule，值为 true。将资源留空。然后，对 xposedminversion（上一步中的 API 版本）和 xposeddescription（你的模块的非常简短的描述）做同样的操作。现在 XML 源码将如下所示：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="de.robv.android.xposed.mods.tutorial"
    android:versionCode="1"
    android:versionName="1.0" >

    <uses-sdk android:minSdkVersion="15" />

    <application
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name" >
        <meta-data
            android:name="xposedmodule"
            android:value="true" />
        <meta-data
            android:name="xposeddescription"
            android:value="Easy example which makes the status bar clock red and adds a smiley" />
        <meta-data
            android:name="xposedminversion"
            android:value="53" />
    </application>
</manifest>
```

## 模块实现

现在你可以为你的模块创建一个类。我的名字叫“Tutorial”，位于包 de.robv.android.xposed.mods.tutorial 中：

```java
package de.robv.android.xposed.mods.tutorial;

public class Tutorial {

}
```

在第一步中，我们只会进行一些记录，以显示模块已被加载。模块可以有一些入口点。你选择哪一个（或哪几个）取决于你想要修改什么。你可以让 Xposed 在 Android 系统启动时调用模块的函数，在准备加载新应用时调用它，当应用的资源初始化时等等。

在本教程稍后的部分，你将了解到需要在一个特定的应用程序中进行必要的更改，因此让我们选择“在加载新应用时通知我”入口点。所有入口点都标记有 IXposedMod 的子接口。在这种情况下，是 IXposedHookLoadPackage，你需要实现它。实际上，它只是一个带有一个参数的方法，该参数提供有关实现模块的上下文的更多信息。在我们的例子中，让我们记录加载的应用程序的名称：

```java
package de.robv.android.xposed.mods.tutorial;

import de.robv.android.xposed.IXposedHookLoadPackage;
import de.robv.android.xposed.XposedBridge;
import de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam;

public class Tutorial implements IXposedHookLoadPackage {
    public void handleLoadPackage(final LoadPackageParam lpparam) throws Throwable {
        XposedBridge.log("Loaded app: " + lpparam.packageName);
    }
}
```

这个 log 方法将消息写入标准的 logcat（标签 Xposed）和/data/data/de.robv.android.xposed.installer/log/debug.log（通过 Xposed Installer 很容易访问）。

## assets/xposed_init

现在唯一缺少的是一个提示，告诉 XposedBridge 哪些类包含这样的入口点。通过一个名为 xposed_init 的文件完成。在 assets 文件夹中创建一个名为 xposed_init 的新文本文件。在此文件中，每行包含一个完全限定的类名。在这种情况下，是 de.robv.android.xposed.mods.tutorial.Tutorial。

# 尝试一下

保存你的文件。然后将项目运行为 Android 应用程序。由于这是你第一次安装它，你需要在使用之前启用它。打开 Xposed Installer 应用程序，确保你已经安装了框架。然后转到“模块”选项卡。你应该在其中找到你的应用程序。选中启用它的复选框。然后重新启动。当然，你不会看到任何变化，但如果检查日志，你应该看到类似以下的内容：

```plaintext
Loading Xposed (for Zygote)...
Loading modules from /data/app/de.robv.android.xposed.mods.tutorial-1.apk
  Loading class de.robv.android.xposed.mods.tutorial.Tutorial
Loaded app: com.android.systemui
Loaded app: com.android.settings
...（后面还有许多应用程序）
```

哇！成功了。现在你有了一个 Xposed 模块。它可能比仅仅写日志更有用...

# 探索目标并找到修改的方法

好的，现在开始的部分可能会因你想要做什么而大不相同。如果你之前修改过 APK，你可能知道在这里如何思考。一般来说，你首先需要获取关于目标实现的一些详细信息。在本教程中，目标是状态栏中的时钟。了解状态栏和许多其他东西是 SystemUI 的一部分会很有帮助。因此，让我们从这里开始搜索。

可能性一：反编译它。这将给你确切的实现，但由于得到的是 smali 格式，很难阅读和理解。可能性二：获取 AOSP 源代码（例如[这里](http://source.android.com/source/downloading.html)或[这里](http://grepcode.com/snapshot/repository.grepcode.com/java/ext/com.google.android/android/4.0.3_r1/)）并在那里查找。这可能与你的 ROM 完全不同，但在这种情况下，它是一个相似甚至相同的实现。我首先会查看 AOSP，看看是否足够。如果我需要更多详细信息，再查看实际的反编译代码。

你可以搜索其中包含“clock”名称的类或字符串的类。还要查找使用的资源和布局。如果你下载了官方 AOSP 代码，你可以开始查看 frameworks/base/packages/SystemUI。你会发现“clock”出现在许多地方。这是正常的，确实会有不同的实现修改的方法。请记住，你“只能”挂钩方法。因此，你必须找到一个可以在方法之前、之后或替换方法的地方插入一些代码来实现你的目标。你应该挂钩尽可能具体的方法，而不是被调用数千次的方法，以避免性能问题和意外的副作用。

在这种情况下，你可能会发现布局 res/layout/status_bar.xml 包含对具有类 com.android.systemui.statusbar.policy.Clock 的自定义视图的引用。现在你可能会想到多种想法。文本颜色是通过 textAppearance 属性定义的，因此更改它的最干净的方式是更改外观定义。但是，使用 Xposed 框架不可能更改样式，并且可能永远不会实现（它太深入本地代码了）。替换状态栏的布局是可能的，但对于你要做的小改变来说有点过火。相反，看看这个类。有一个名为 updateClock 的方法，似乎每分钟都会被调用以更新时间：

```java
final void updateClock() {
    mCalendar.setTimeInMillis(System.currentTimeMillis());
    setText(getSmallTime());
}
```

这看起来非常适合修改，因为它是一个非常具体的方法，似乎是设置时钟文本的唯一方法。如果我们在调用此方法之后添加一些代码，该代码更改时钟的颜色和文本，那应该有效。那么我们就这样做吧。

对于仅文本颜色而言，有一种更好的方法。请查看“修改布局”中“替换资源”的示例。

# 使用反射查找和挂钩方法

我们已经知道什么了？我们有一个在`com.android.systemui.statusbar.policy.Clock`类中的`updateClock`方法，我们想要拦截它。我们在 SystemUI 源代码中找到了这个类，因此它只能在 SystemUI 的进程中使用。其他一些类属于框架并且在任何地方都可用。如果我们尝试在`handleLoadPackage`方法中直接获取有关此类的信息和引用，这将失败，因为这是错误的进程。因此，让我们实现一个条件，只有在要加载的特定包时才执行某些代码：

```java
public void handleLoadPackage(LoadPackageParam lpparam) throws Throwable {
    if (!lpparam.packageName.equals("com.android.systemui"))
        return;

    XposedBridge.log("we are in SystemUI!");
}
```

使用参数，我们可以轻松检查我们是否在正确的包中。一旦我们验证了这一点，我们就可以使用从此变量中引用的`ClassLoader`访问该包中的类。现在我们可以查找`com.android.systemui.statusbar.policy.Clock`类及其`updateClock`方法，并告诉 XposedBridge 挂钩它：

```java
package de.robv.android.xposed.mods.tutorial;

import static de.robv.android.xposed.XposedHelpers.findAndHookMethod;
import de.robv.android.xposed.IXposedHookLoadPackage;
import de.robv.android.xposed.XC_MethodHook;
import de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam;

public class Tutorial implements IXposedHookLoadPackage {
    public void handleLoadPackage(final LoadPackageParam lpparam) throws Throwable {
    	if (!lpparam.packageName.equals("com.android.systemui"))
            return;

    	findAndHookMethod("com.android.systemui.statusbar.policy.Clock", lpparam.classLoader, "updateClock", new XC_MethodHook() {
    		@Override
    		protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
    			// this will be called before the clock was updated by the original method
    		}
    		@Override
    		protected void afterHookedMethod(MethodHookParam param) throws Throwable {
    			// this will be called after the clock was updated by the original method
    		}
	});
    }
}
```

`findAndHookMethod`是一个辅助函数。请注意静态导入，如果按照链接页面上的描述进行配置，它将自动添加。此方法使用 SystemUI 包的`ClassLoader`查找`Clock`类。然后，在其中查找`updateClock`方法。如果此方法有任何参数，那么之后你必须列出这些参数的类型（类）。有不同的方法可以做到这一点，但由于我们的方法没有任何参数，因此我们现在跳过此步骤。作为最后一个参数，你需要提供`XC_MethodHook`类的实现。对于较小的修改，你可以使用匿名类。如果代码很多，最好在这里仅创建实例并创建正常的类。助手然后将执行上述描述的所有挂钩方法所需的一切。

`XC_MethodHook`中有两个可以重写的方法。你可以重写其中一个或两个，但后者绝对没有意义。这些方法是`beforeHookedMethod`和`afterHookedMethod`。猜测它们在原始方法之前/之后执行并不太困难。你可以使用“before”方法来评估/操作方法调用的参数（通过`param.args`）甚至阻止对原始方法的调用（发送你自己的结果）。“after”方法可用于基于原始方法的结果执行某些操作。你还可以在此时操纵结果。当然，你还可以添加你自己的代码，该代码应在方法调用之前/之后执行。

如果要完全替换方法，请查看子类`XC_MethodReplacement`，在这里你只需要重写`replaceHookedMethod`。

XposedBridge 保持每个挂钩方法的注册回调列表。具有最高优先级（如在`hookMethod`中定义的）的

回调首先被调用。原始方法始终具有最低优先级。因此，如果你已经用回调 A（优先级高）和 B（默认优先级）挂钩了一个方法，那么每当调用挂钩方法时，控制流程将如下：`A.before -> B.before -> original method -> B.after -> A.after`。因此，A 可以影响 B 看到的参数，这可以在将它们传递之前进一步更改它们。原始方法的结果可以由 B 首先处理，但 A 对原始调用者有最后的决定权。

## 最后步骤：在方法调用之前/之后执行自己的代码

好了，现在你有一个在每次调用`updateClock`方法时都会被调用的方法，具有完全相同的上下文（即你在 SystemUI 进程中）。现在让我们修改一些东西。

首先要检查的事情：我们是否有对具体`Clock`对象的引用？是的，我们有，在`param.thisObject`参数中。因此，如果方法是通过`myClock.updateClock()`调用的，那么`param.thisObject`将是`myClock`。

接下来：我们可以对时钟做些什么？`Clock`类不可用，你不能将`param.thisObject`强制转换为类（甚至不要试图这样做）。但是它继承自`TextView`。因此，一旦你将`Clock`引用转换为`TextView`，就可以使用`setText`、`getText`和`setTextColor`等方法。更改应该在原始方法设置新时间之后完成。由于在方法调用之前没有什么可做的，我们可以省略`beforeHookedMethod`。调用（空）“super”方法是不必要的。

因此，以下是完整的源代码：

```java
package de.robv.android.xposed.mods.tutorial;

import static de.robv.android.xposed.XposedHelpers.findAndHookMethod;
import android.graphics.Color;
import android.widget.TextView;
import de.robv.android.xposed.IXposedHookLoadPackage;
import de.robv.android.xposed.XC_MethodHook;
import de.robv.android.xposed.callbacks.XC_LoadPackage.LoadPackageParam;

public class Tutorial implements IXposedHookLoadPackage {
    public void handleLoadPackage(final LoadPackageParam lpparam) throws Throwable {
        if (!lpparam.packageName.equals("com.android.systemui"))
            return;

        findAndHookMethod("com.android.systemui.statusbar.policy.Clock", lpparam.classLoader, "updateClock", new XC_MethodHook() {
            @Override
            protected void afterHookedMethod(MethodHookParam param) throws Throwable {
                TextView tv = (TextView) param.thisObject;
                String text = tv.getText().toString();
                tv.setText(text + " :)");
                tv.setTextColor(Color.RED);
            }
        });
    }
}
```

# 为结果感到高兴

现在再次安装/启动你的应用程序。由于在第一次启动时已经在 Xposed Installer 中启用了它，因此不需要再次进行启用，重新启动就足够了。但是，如果你正在使用红色时钟示例，则可能会希望禁用它。它们都使用其`updateClock`处理程序的默认优先级，因此你无法知道哪个将获胜（实际上取决于处理程序方法的字符串表示形式，但不要依赖于此）。

## 结论

我知道这篇教程非常长。但我希望你现在不仅可以实现一个绿色时钟，还可以实现完全不同的东西。找到好的挂钩方法是经验的问题，因此从一些相对简单的事物开始。在开始时尝试大量使用日志功能，以确保一切在你期望的时候都被调用。现在：玩得开心！

# Class XposedBridge

## log

`log`方法是将调试输出记录到标准 logcat 和一个名为`/data/xposed/debug.log`的文件的简便方法。它可以接受日志消息或`Throwable`。在后一种情况下，它将打印堆栈跟踪。

## hookAllMethods / hookAllConstructors

如果要挂钩具有特定名称的所有方法或类中的所有构造函数，可以使用这些方法。如果有不同的变体，但您想在调用它们之前/之后执行一些代码，则这将非常有用。请注意，其他 ROM 可能有额外的变体也会被此方法挂钩。尤其要注意回调中获取的参数。

# Class XposedHelpers

我建议将此类添加到 Eclipse 的静态导入的收藏夹中：`Window => Preferences => Java => Editor => Content Assist => Favorites => New Type`，输入`de.robv.android.xposed.XposedHelpers`。通过这样做，Eclipse 将在您开始键入例如“get..”时自动建议此类的方法，并将该方法的静态导入（这意味着您的代码中不可见类名）。

## findMethod / findConstructor / findField

有几种方法可以在不使用反射的情况下检索方法、构造函数和字段。此外，您可以使用某些参数类型的“最佳匹配”来查找方法和构造函数。例如，您可以使用`call findMethodBestMatch(Class<?> clazz, String methodName, Object... args)`，其中参数是`TextView`，它还将查找一个以`View`参数为参数的给定名称的方法，如果不存在更具体的变体。

## callMethod / callStaticMethod / newInstance

利用上面提到的`findXXX`方法，这些方法使调用方法或创建类的新实例变得容易。调用者不必为此使用反射。无需在检索方法之前，只需使用这些方法即可即时调用它。参数的类型将自动从实际参数值复制，并调用最匹配的方法。如果要显式指定参数的类型，请创建一个`Class<?>`数组并将其传递给`callXXX/newInstance`。您可以将数组中的某些项留空（null），以使用实际参数的类，但数组长度必须与参数数量相匹配。

## getXXXField / setXXXField / getStaticXXXField / setStaticXXXField

这些是用于轻松获取和设置实例和类变量内容的包装器。您只需要对象引用、字段名称和类型（以及设置器的新值）。如果要获取/设置静态字段而没有对象引用，可以使用`getStaticXXX`和`setStaticXXX`方法。但是，当有对象引用时，无需区分静态和实例字段，`getXXX`和`setXXX`可以同时设置两者。

## getAdditionalXXXField / setAdditionalXXXField

这些方法让您将任何值与对象实例或整个类（如静态字段）关联起来。这些值存储在键值映射中，因此您可以为每个对象保存多个值。键可以是任何字符串，包括对象实际具有的字段的名称。请注意，您无法通过调用`getAdditionalInstanceField`检索使用`setAdditionalStaticField`存储的值。请改用`getAdditionalStaticField`，该方法有一个变体，它接受一个对象并自动查找其类。

## assetAsByteArray

此方法将资源作为字节数组返回。如果要加载模块的资源，可以使用类似以下的内容：

```java
public class XposedTweakbox implements IXposedHookZygoteInit {
    @Override
    public void initZygote(StartupParam startupParam) throws Throwable {
        Resources tweakboxRes = XModuleResources.createInstance(startupParam.modulePath, null);
        byte[] crtPatch = assetAsByteArray(tweakboxRes, "crtfix_samsung_d506192d5049a4042fb84c0265edfe42.bsdiff");
    }
}
```

## getMD5Sum

返回文件系统上文件的 MD5 摘要。当前应用程序需要对文件具有读取访问权限（在`init`方法中，您具有 root 权限，因此不应该是问题）。

## getProcessPid

通过其`/proc/[pid]/cmdline`的第一部分找到进程并将其 PID 作为字符串返回。

# 简单资源

```java
@Override
public void initZygote(IXposedHookZygoteInit.StartupParam startupParam) throws Throwable {
    XResources.setSystemWideReplacement("android", "bool", "config_unplugTurnsOnScreen", false);
}

@Override
public void handleInitPackageResources(InitPackageResourcesParam resparam) throws Throwable {
    // 仅替换SystemUI
    if (!resparam.packageName.equals("com.android.systemui"))
        return;

    // 不同的指定要替换的资源的方式
    resparam.res.setReplacement(0x7f080083, "YEAH!"); // WLAN 切换文本。不应该这样做，因为ID不是固定的。仅用于框架资源，您可以使用 android.R.string.something
    resparam.res.setReplacement("com.android.systemui:string/quickpanel_bluetooth_text", "WOO!");
    resparam.res.setReplacement("com.android.systemui", "string", "quickpanel_gps_text", "HOO!");
    resparam.res.setReplacement("com.android.systemui", "integer", "config_maxLevelOfSignalStrengthIndicator", 6);
}
```

这是“简单”替换的示例，其中可以直接提供替换值。这适用于：Boolean、Color、Integer、int[]、String 和 String[]。

如您所见，有几种不同的方式可以设置替换资源。对于属于 Android 框架的资源（对所有应用程序可用）且应该在所有地方替换的资源，您在 `initZygote` 方法中调用 `XResources.setSystemWideReplacement(...)`。对于特定于应用程序的资源，您需要在 `hookInitPackageResources` 中调用 `res.setReplacement`，在验证您是否在正确的应用程序之后。此时不应该使用 `setSystemWideReplacement`，因为它可能会产生您没有预期的副作用。

替换 Drawable 的操作类似。但是，您不能只使用 Drawable 作为替换，因为这可能导致 Drawable 的相同实例被不同的 ImageView 引用。因此，您需要使用包装器：

```java
resparam.res.setReplacement("com.android.systemui", "drawable", "status_bar_background", new XResources.DrawableLoader() {
    @Override
    public Drawable newDrawable(XResources res, int id) throws Throwable {
        return new ColorDrawable(Color.WHITE);
    }
});
```

# 复杂资源

更复杂的资源（例如动画 Drawable）必须从您模块的资源中引用。假设您想要替换电池图标。以下是代码：

```java
package de.robv.android.xposed.mods.coloredcirclebattery;

import android.content.res.XModuleResources;
import de.robv.android.xposed.IXposedHookInitPackageResources;
import de.robv.android.xposed.IXposedHookZygoteInit;
import de.robv.android.xposed.callbacks.XC_InitPackageResources.InitPackageResourcesParam;

public class ColoredCircleBattery implements IXposedHookZygoteInit, IXposedHookInitPackageResources {
    private static String MODULE_PATH = null;

    @Override
    public void initZygote(StartupParam startupParam) throws Throwable {
        MODULE_PATH = startupParam.modulePath;
    }

    @Override
    public void handleInitPackageResources(InitPackageResourcesParam resparam) throws Throwable {
        if (!resparam.packageName.equals("com.android.systemui"))
            return;

        XModuleResources modRes = XModuleResources.createInstance(MODULE_PATH, resparam.res);
        resparam.res.setReplacement("com.android.systemui", "drawable", "stat_sys_battery", modRes.fwd(R.drawable.battery_icon));
        resparam.res.setReplacement("com.android.systemui", "drawable", "stat_sys_battery_charge", modRes.fwd(R.drawable.battery_icon_charge));
    }
}
```

您可以根据需要为替换资源命名。我选择了 `battery_icon` 而不是 `stat_sys_battery`，以便在此文本中更容易区分它们。

然后，将 Drawables "battery_icon" 和 "battery_icon_charge" 添加到您的模块。在最简单的情况下，这意味着您添加 "res/drawables/battery_icon.png" 和 "res/drawables/battery_icon_charge.png"，但是您可以使用 Android 提供的定义资源的所有方式。因此，对于带有动画图标，您将使用带有动画列表的 XML 文件，并引用其他 Drawables，这些 Drawables 当然也必须在您的模块中。

通过这些替换，您要求 Xposed 将对某个特定资源的所有请求都转发到您自己的模块。因此，您可以像在自己的应用程序中一样使用资源进行替换。这也意味着您可以利用限定符，例如如果需要横向或低密度的不同资源。翻译也可以以相同的方式提供。如果原始资源使用了限定符，那么您可能也需要这样做。如前所述，请求将被转发，因此完全由您模块的资源处理，该资源不知道其他翻译是否存在。

这种技术基本上适用于所有资源类型，除了一些特殊的东西，如主题。

# 修改布局

尽管理论上可以使用上述描述的技术完全替换布局，但这样做有很多缺点。您必须复制来自原始布局的完整布局，这会减少与其他 ROM 的兼容性。可能会丢失主题。只能有一个模块替换布局。如果尝试两个模块，最后一个将获胜。最重要的是，IDs 和对其他资源的引用相当难以定义。因此，我真的不建议这样做。

作为很好的替代，您可以使用后充气挂钩。操作如下：

```java
@Override
public void handleInitPackageResources(InitPackageResourcesParam resparam) throws Throwable {
    if (!resparam.packageName.equals("com.android.systemui"))
        return;

    resparam.res.hookLayout("com.android.systemui", "layout", "status_bar", new XC_LayoutInflated() {
        @Override
        public void handleLayoutInflated(LayoutInflatedParam liparam) throws Throwable

 {
            TextView clock = (TextView) liparam.view.findViewById(
                    liparam.res.getIdentifier("clock", "id", "com.android.systemui"));
            clock.setTextColor(Color.RED);
        }
    });
}
```

每当 "status_bar" 布局被充气时，都会调用回调 `handleLayoutInflated`。在作为参数传递的 `LayoutInflatedParam` 对象中，您可以找到刚刚创建的视图，并根据需要对其进行修改。您还可以获取 `resNames` 来标识该方法所调用的布局（如果您对多个布局使用相同的方法），以及 `variant`，该 variant 可能包含 `layout-land`，如果这是加载的布局版本。`res` 帮助您从与布局相同的源获取 ID 或其他资源。

# Android Studio (基于 Gradle)

Xposed Framework API 已发布在 Bintray/jCenter 上: [https://bintray.com/rovo89/de.robv.android.xposed/api](https://bintray.com/rovo89/de.robv.android.xposed/api) 这使得通过在应用的 app/build.gradle 中简单地添加 Gradle 依赖项来引用它变得很容易：

```groovy
repositories {
    jcenter()
}

dependencies {
    provided 'de.robv.android.xposed:api:82'
}
```

非常重要的一点是使用 `provided` 而不是 `compile`！后者会将 API 类包含在您的 APK 中，这可能会在 Android 4.x 上引起问题。使用 `provided` 仅使 API 类能够从您的模块中使用，但 APK 中只会有对它们的引用。实际的实现将在用户安装 Xposed Framework 时提供。

在大多数情况下，repositories 块已经存在，并且通常已经存在一些依赖项。在这种情况下，只需将 `provided` 行添加到现有的 dependencies 块中。

还有 API 的文档可用（请参见下文）。不幸的是，我没有找到启用 API 源码的自动下载的好方法，除非使用这两行：

```groovy
provided 'de.robv.android.xposed:api:82'
provided 'de.robv.android.xposed:api:82:sources'
```

Gradle 缓存文件的方式，Android Studio 将自动将第二个 jar 设置为第一个 jar 的源。欢迎提出更好的建议！

请确保禁用 Instant Run（File -> Settings -> Build, Execution, Deployment -> Instant Run），否则您的类将不会直接包含在 APK 中，而是通过一个存根应用程序加载，这是 Xposed 无法处理的。

# API 版本

[最新 API 版本徽章](http://api.xposed.info/versions.json)

通常，API 版本等于构建在其上的 Xposed 版本。然而，仅有一些框架更改实际上导致 API 更改，您可以在更改日志中看到。仅当有 API 更改时，我才会发布新的 API 版本，并且我会尽量使它们与现有模块兼容。因此，当您使用 API 版本 82 构建模块时，它很可能也适用于 Xposed 版本 90。

我始终建议最终用户使用最新的 Xposed 版本，因此使用可用的最高 API 版本通常没有问题。通常，您应该将 AndroidManifest.xml 中的 `xposedminversion` 设置为您使用的 API 版本。如果依赖于未导致 API 更改的框架更改（例如因为修复了某个错误），请随时将 `xposedminversion` 设置为模块所需的最小 Xposed 版本。

如果要支持 Lollipop 之前的 ROM，只能使用 API 版本 53，因为 Android 4.x 的最新 Xposed 版本为 54。请注意，提供的这个版本的 sources jar 与实际实现不匹配，它只提供了文档。

# 其他

在 [http://api.xposed.info](http://api.xposed.info) 上，您可以找到 Xposed Framework API 的 Javadoc。

如果您想确保 zip 发行版或 API jar 的确是由我（rovo89）创建的，请使用 GnuPG 验证 .asc 文件。

我的主密钥的指纹是 0DC8 2B3E B1C4 6D48 33B4 C434 E82F 0871 7235 F333（简短符号：7235F333）。发行版使用子密钥 852109AA 签名。

## IXposedHookLoadPackage

加载应用程序时调用此方法。它很早就被调用了，甚至在 Application.onCreate（）被调用之前。模块可以在此处设置其应用程序特定挂钩。

```
public abstract void handleLoadPackage (XC_LoadPackage.LoadPackageParam lpparam)
```

## XC_LoadPackage.LoadPackageParam

包装有关正在加载的应用程序的信息

```
public ApplicationInfo	appInfo
public ClassLoader	classLoader
public boolean	isFirstApplication
public String	packageName
public String	processName
```

## XCallback.Param

Xposed 回调参数的基类

```
// 这可以用于存储回调范围的任何数据。
// 使用它而不是实例变量，因为它有一个明确的引用，
// 例如，对一个方法的每个单独调用，即使是递归调用相同的方法。
public Bundle getExtra ()
// 返回用setObjectExtra存储的对象
public Object getObjectExtra (String key)
// 存储回调作用域的任何对象。对于支持它的数据类型，请改用getExtra（）返回的Bundle。
public void setObjectExtra (String key, Object o)
```

## XC_MethodHook

方法挂钩的回调类。通常，会创建此类的匿名子类

```
protected void afterHookedMethod (XC_MethodHook.MethodHookParam param)
protected void beforeHookedMethod (XC_MethodHook.MethodHookParam param)
```

## XC_MethodHook.MethodHookParam

包装有关方法调用的信息并允许对其进行影响。

```
public Object[] args
public Member method
public Object thisObject
public Object getResult ()
```

## XC_MethodHook.Unhook

可以解除方法/构造函数的挂钩的对象

```
public XC_MethodHook getCallback () // 返回已注册的回调
public Member getHookedMethod () // 返回已挂起的方法/构造函数
public void unhook () // 删除回调
```

## XC_MethodReplacement

XC_MethodHook 的一个特例，它完全取代了原来的方法。

```
// 创建一个始终返回特定值的回调。
static XC_MethodReplacement	returnConstant(Object result)
// 类似returnConstant（Object），但允许指定回调的优先级。
static XC_MethodReplacement	returnConstant(int priority, Object result)
// 用于完全替换方法的快捷方式。
abstract Object	replaceHookedMethod(XC_MethodHook.MethodHookParam param)
```

## XposedBridge

这个类包含 Xposed 的大部分核心逻辑，例如本地端使用的初始化和回调。它还包括添加新钩子的方法。

```
// 钩住指定类的所有构造函数。
static Set<XC_MethodHook.Unhook>	hookAllConstructors(Class<?> hookClass, XC_MethodHook callback)

// 挂接指定类中声明的具有特定名称的所有方法。
static Set<XC_MethodHook.Unhook>	hookAllMethods(Class<?> hookClass, String methodName, XC_MethodHook callback)

// 用指定的回调钩住任何方法（或构造函数）。
static XC_MethodHook.Unhook	hookMethod(Member hookMethod, XC_MethodHook callback)

// 基本上与Method.invoke（Object，Object…）相同，但调用的原始方法与Xposed拦截之前相同。
static Object	invokeOriginalMethod(Member method, Object thisObject, Object[] args)

static void	log(String text)
static void	log(Throwable t)
```

## XposedHelpers

简化挂钩和调用方法/构造函数、获取和设置字段的帮助程序

### static byte[] assetAsByteArray(Resources res, String path)

- Loads an asset from a resource object and returns the content as byte array.

### static Object callMethod(Object obj, String methodName, Class[]<?> parameterTypes, Object... args)

- Calls an instance or static method of the given object.

### static Object callMethod(Object obj, String methodName, Object... args)

- Calls an instance or static method of the given object.

### static Object callStaticMethod(Class<?> clazz, String methodName, Class[]<?> parameterTypes, Object... args)

- Calls a static method of the given class.

### static Object callStaticMethod(Class<?> clazz, String methodName, Object... args)

- Calls a static method of the given class.

### static int decrementMethodDepth(String method)

- Decrements the depth counter for the given method.

### static XC_MethodHook.Unhook findAndHookConstructor(Class<?> clazz, Object... parameterTypesAndCallback)

- Look up a constructor and hook it.

### static XC_MethodHook.Unhook findAndHookConstructor(String className, ClassLoader classLoader, Object... parameterTypesAndCallback)

- Look up a constructor and hook it.

### static XC_MethodHook.Unhook findAndHookMethod(Class<?> clazz, String methodName, Object... parameterTypesAndCallback)

- Look up a method and hook it.

### static XC_MethodHook.Unhook findAndHookMethod(String className, ClassLoader classLoader, String methodName, Object... parameterTypesAndCallback)

- Look up a method and hook it.

### static Class<?> findClass(String className, ClassLoader classLoader)

- Look up a class with the specified class loader.

### static Class<?> findClassIfExists(String className, ClassLoader classLoader)

- Look up and return a class if it exists.

### static Constructor<?>	findConstructorBestMatch(Class<?> clazz, Class[]<?> parameterTypes, Object[] args)

- Look up a constructor in a class and set it to accessible.

### static Constructor<?>	findConstructorBestMatch(Class<?> clazz, Object... args)

- Look up a constructor in a class and set it to accessible.

### static Constructor<?>	findConstructorBestMatch(Class<?> clazz, Class...<?> parameterTypes)

- Look up a constructor in a class and set it to accessible.

### static Constructor<?> findConstructorExact(String className, ClassLoader classLoader, Object... parameterTypes)

- Look up a constructor of a class and set it to accessible.

### static Constructor<?>	findConstructorExact(Class<?> clazz, Class...<?> parameterTypes)

- Look up a constructor of a class and set it to accessible.

### static Constructor<?>	findConstructorExact(Class<?> clazz, Object... parameterTypes)

- Look up a constructor of a class and set it to accessible.

### static Constructor<?>	findConstructorExactIfExists(Class<?> clazz, Object... parameterTypes)

- Look up and return a constructor if it exists.

### static Constructor<?> findConstructorExactIfExists(String className, ClassLoader classLoader, Object... parameterTypes)

- Look up and return a constructor if it exists.

### static Field findField(Class<?> clazz, String fieldName)

- Look up a field in a class and set it to accessible.

### static Field findFieldIfExists(Class<?> clazz, String fieldName)

- Look up and return a field if it exists.

### static Field findFirstFieldByExactType(Class<?> clazz, Class<?> type)

- Returns the first field of the given type in a class.

### static Method findMethodBestMatch(Class<?> clazz, String methodName, Class[]<?> parameterTypes, Object[] args)

- Look up a method in a class and set it to accessible.

### static Method findMethodBestMatch(Class<?> clazz, String methodName, Object... args)

- Look up a method in a class and set it to accessible.

### static Method findMethodBestMatch(Class<?> clazz, String methodName, Class...<?> parameterTypes)

- Look up a method in a class and set it to accessible.

### static Method findMethodExact(Class<?> clazz, String methodName, Class...<?> parameterTypes)

- Look up a method in a class and set it to accessible.

### static Method findMethodExact(Class<?> clazz, String methodName, Object... parameterTypes)

- Look up a method in a class and set it to accessible.

### static Method findMethodExact(String className, ClassLoader classLoader, String methodName, Object... parameterTypes)

- Look up a method in a class and set it to accessible.

### static Method findMethodExactIfExists(Class<?> clazz, String methodName, Object... parameterTypes)

- Look up and return a method if it exists.

### static Method findMethodExactIfExists(String className, ClassLoader classLoader, String methodName, Object... parameterTypes)

- Look up and return a method if it exists.

### static Method[] findMethodsByExactParameters(Class<?> clazz, Class<?> returnType, Class...<?> parameterTypes)

- Returns an array of all methods declared/overridden in a class with the specified parameter types.

### static Object getAdditionalInstanceField(Object obj, String key)

- Returns a value which was stored with setAdditionalInstanceField(Object, String, Object).

### static Object getAdditionalStaticField(Class<?> clazz, String key)

- Like setAdditionalInstanceField(Object, String, Object), but the value is returned for clazz.

### static Object getAdditionalStaticField(Object obj, String key)

- Like getAdditionalInstanceField(Object, String), but the value is returned for the class of obj.

### static boolean getBooleanField(Object obj, String fieldName)

- Returns the value of a boolean field in the given object instance.

### static byte getByteField(Object obj, String fieldName)

- Returns the value of a byte field in the given object instance.

### static char getCharField(Object obj, String fieldName)

- Returns the value of a char field in the given object instance.

### static Class[]<?>	getClassesAsArray(Class...<?> clazzes)

- Returns an array of the given classes.

### static double getDoubleField(Object obj, String fieldName)

- Returns the value of a double field in the given object instance.

### static float getFloatField(Object obj, String fieldName)

- Returns the value of a float field in the given object instance.

### static int getIntField(Object obj, String fieldName)

- Returns the value of an int field in the given object instance.

### static long getLongField(Object obj, String fieldName)

- Returns the value of a long field in the given object instance.

### static String getMD5Sum(String file)

- Returns the lowercase hex string representation of a file's MD5 hash sum.

### static int getMethodDepth(String method)

- Returns the current depth counter for the given method.

### static Object getObjectField(Object obj, String fieldName)

- Returns the value of an object field in the given object instance.

### static Class[]<?> getParameterTypes(Object... args)

- Returns an array with the classes of the given objects.

### static short getShortField(Object obj, String fieldName)

- Returns the value of a short field in the given object instance.

### static boolean getStaticBooleanField(Class<?> clazz, String fieldName)

- Returns the value of a static boolean field in the given class.

### static byte getStaticByteField(Class<?> clazz, String fieldName)

- Sets the value of a static byte field in the given class.

### static char getStaticCharField(Class<?> clazz, String fieldName)

- Sets the value of a static char field in the given class.

### static double getStaticDoubleField(Class<?> clazz, String fieldName)

- Sets the value of a static double field in the given class.

### static float getStaticFloatField(Class<?> clazz, String fieldName)

- Sets the value of a static float field in the given class.

### static int getStaticIntField(Class<?> clazz, String fieldName)

- Sets the value of a static int field in the given class.

### static long getStaticLongField(Class<?> clazz, String fieldName)

- Sets the value of a static long field in the given class.

### static Object getStaticObjectField(Class<?> clazz, String fieldName)

- Returns the value of a static object field in the given class.

### static short getStaticShortField(Class<?> clazz, String fieldName)

- Sets the value of a static short field in the given class.

### static Object getSurroundingThis(Object obj)

- For inner classes, returns the surrounding instance, i.e.

### static int incrementMethodDepth(String method)

- Increments the depth counter for the given method.

### static Object newInstance(Class<?> clazz, Object... args)

- Creates a new instance of the given class.

### static Object newInstance(Class<?> clazz, Class[]<?> parameterTypes, Object... args)

- Creates a new instance of the given class.

### static Object removeAdditionalInstanceField(Object obj, String key)

- Removes and returns a value which was stored with setAdditionalInstanceField(Object, String, Object).

### static Object removeAdditionalStaticField(Class<?> clazz, String key)

- Like setAdditionalInstanceField(Object, String, Object), but the value is removed and returned for clazz.

### static Object removeAdditionalStaticField(Object obj, String key)

- Like removeAdditionalInstanceField(Object, String), but the value is removed and returned for the class of obj.

### static Object setAdditionalInstanceField(Object obj, String key, Object value)

- Attaches any value to an object instance.

### static Object setAdditionalStaticField(Object obj, String key, Object value)

- Like setAdditionalInstanceField(Object, String, Object), but the value is stored for the class of obj.

### static Object setAdditionalStaticField(Class<?> clazz, String key, Object value)

- Like setAdditionalInstanceField(Object, String, Object), but the value is stored for clazz.

### static void setBooleanField(Object obj, String fieldName, boolean value)

- Sets the value of a boolean field in the given object instance.

### static void setByteField(Object obj, String fieldName, byte value)

- Sets the value of a byte field in the given object instance.

### static void setCharField(Object obj, String fieldName, char value)

- Sets the value of a char field in the given object instance.

### static void setDoubleField(Object obj, String fieldName, double value)

- Sets the value of a double field in the given object instance.

### static void setFloatField(Object obj, String fieldName, float value)

- Sets the value of a float field in the given object instance.

### static void setIntField(Object obj, String fieldName, int value)

- Sets the value of an int field in the given object instance.

### static void setLongField(Object obj, String fieldName, long value)

- Sets the value of a long field in the given object instance.

### static void setObjectField(Object obj, String fieldName, Object value)

- Sets the value of an object field in the given object instance.

### static void setShortField(Object obj, String fieldName, short value)

- Sets the value of a short field in the given object instance.

### static void setStaticBooleanField(Class<?> clazz, String fieldName, boolean value)

- Sets the value of a static boolean field in the given class.

### static void setStaticByteField(Class<?> clazz, String fieldName, byte value)

- Sets the value of a static byte field in the given class.

### static void setStaticCharField(Class<?> clazz, String fieldName, char value)

- Sets the value of a static char field in the given class.

### static void setStaticDoubleField(Class<?> clazz, String fieldName, double value)

- Sets the value of a static double field in the given class.

### static void setStaticFloatField(Class<?> clazz, String fieldName, float value)

- Sets the value of a static float field in the given class.

### static void setStaticIntField(Class<?> clazz, String fieldName, int value)

- Sets the value of a static int field in the given class.

### static void setStaticLongField(Class<?> clazz, String fieldName, long value)

- Sets the value of a static long field in the given class.

### static void setStaticObjectField(Class<?> clazz, String fieldName, Object value)

- Sets the value of a static object field in the given class.

### static void setStaticShortField(Class<?> clazz, String fieldName, short value)

- Sets the value of a static short field in the given class.

# 查找方法并挂钩

查找方法并挂钩。最后一个参数必须是挂钩的回调函数。

这个方法结合了对 `findMethodExact(Class, String, Object...)` 和 `XposedBridge.hookMethod(Member, XC_MethodHook)` 的调用。

该方法必须在给定的类中声明或被覆盖，继承的方法不会被考虑！这是因为每个方法实现在内存中只存在一次，当类继承它时，它们只是获得该实现的另一个引用。因此，挂钩方法适用于所有继承相同实现的类。您必须期望挂钩适用于子类（除非它们覆盖了该方法），但不应该担心挂钩适用于超类，因此有了这个“限制”。否则可能会出现不希望的或甚至危险的挂钩，例如，如果您挂钩 `SomeClass.equals()`，并且在某些 ROM 上该类没有覆盖 `equals()`，则会使您挂钩 `Object.equals()`。

有两种指定参数类型的方法。如果您已经有对 `Class` 的引用，请使用它。对于 Android 框架类，您通常可以使用类似 `String.class` 的东西。如果您没有类引用，可以简单地将完整的类名作为字符串使用，例如 `java.lang.String` 或 `com.example.MyClass`。它将传递给 `findClass(String, ClassLoader)`，并使用与目标方法相同的类加载器，请参阅其文档以了解允许的表示法。

原始类型，如 `int`，可以使用 `int.class`（推荐）或 `Integer.TYPE` 指定。请注意，`Integer.class` 不是指 `int` 而是指 `Integer`，它是一个正常的类（装箱的原始类型）。因此，在方法期望 int 参数时不能使用它 - 但在这种情况下必须用于 `Integer` 参数，因此详细检查方法签名。

作为这个方法的最后一个参数（在目标方法参数列表之后），您需要指定在调用方法时应该执行的回调。通常，它是 `XC_MethodHook` 或 `XC_MethodReplacement` 的匿名子类。

## 获取类的所有方法

```
// 获取类的所有方法
Method[] methods = klass.getDeclaredMethods();
// 打印方法信息
for (Method method : methods) {
    XposedBridge.log("Method Name: " + method.getName());
    XposedBridge.log("Return Type: " + method.getReturnType().getName());

    // 打印方法的参数类型
    Class<?>[] parameterTypes = method.getParameterTypes();
    XposedBridge.log("Parameter Types: ");
    for (Class<?> parameterType : parameterTypes) {
        XposedBridge.log(parameterType.getName() + " ");
    }
    XposedBridge.log("\n-----------------------------");
}
```

# Xposed 快速 hook 关键点

## 通过界面定位到具体的 Activity

```
adb shell dumpsys activity | findstr "mFocusedActivity"
```

## 流程

- 通过 xposed 读取 jar 中的所有类
- 然后 hook,然后读取所有方法 hook
- 然后通过关键字，匹配参数，匹配返回值，快速得到操作日志

```java
public static void hook_byJar(final XC_LoadPackage.LoadPackageParam loadPackageParam, String jarFile) throws Exception {
    try { //通过将给定路径名字符串转换为抽象路径名来创建一个新File实例
        File f = new File(jarFile);
        URL url1 = f.toURI().toURL();
        URLClassLoader myClassLoader = new URLClassLoader(new URL[] { url1 }, Thread.currentThread().getContextClassLoader()); //通过jarFile和JarEntry得到所有的类
        JarFile jar = new JarFile(jarFile); //返回zip文件条目的枚举
        Enumeration < JarEntry > enumFiles = jar.entries();
        JarEntry entry; //测试此枚举是否包含更多的元素
        while (enumFiles.hasMoreElements()) {
            entry = (JarEntry) enumFiles.nextElement();
            if (entry.getName().indexOf("META-INF") < 0) {
                String classFullName = entry.getName();
                if (classFullName.indexOf(".class") < 0) {
                    classFullName = classFullName.substring(0, classFullName.length() - 1);
                } else {
                    Map < String, Object > hashMap = new HashMap < String, Object > (); // 这里通过包名对部分类进行过滤，方式由于类不存在引起的错误。
                    hashMap.put("com/test/test/test/", new ArrayList < String > ());
                    boolean isOkClass = false;
                    for (Map.Entry < String, Object > m: hashMap.entrySet()) {
                        String name = m.getKey();
                        ArrayList < String > list = (ArrayList < String > ) m.getValue();
                        if (classFullName.startsWith(name)) {
                            isOkClass = true;
                            for (String str: list) {
                                if (classFullName.startsWith(str)) {
                                    isOkClass = false;
                                }
                            }
                            break;
                        }
                    }
                    if (isOkClass) { //去掉后缀.class
                        String className = classFullName.substring(0, classFullName.length() - 6).replace("/", "."); // log(classFullName);
                        try {
                            final Class < ? > myclass = myClassLoader.loadClass(className);
                            for (final Method method: myclass.getDeclaredMethods()) {
                                if (!Modifier.isAbstract(method.getModifiers())) {
                                    XposedBridge.hookMethod(method, new XC_MethodHook() {
                                        @Override protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
                                            String before_className = myclass.getName();
                                            String methodName = param.method.getName();
                                            super.beforeHookedMethod(param);
                                        }
                                        @Override protected void afterHookedMethod(MethodHookParam param) throws Throwable {
                                            String before_className = myclass.getName();
                                            String methodName = param.method.getName();
                                            super.afterHookedMethod(param);
                                        }
                                    });
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```
