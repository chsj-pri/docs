# 参考
- https://jesse205.github.io/MagiskChineseDocument/

# BusyBox

Magisk 随附一个功能完备的 BusyBox 二进制文件（包括完整的 SELinux 支持）。可执行文件位于`/data/adb/magisk/busybox`。Magisk 的 BusyBox 支持运行时可切换的“ASH Standalone Shell Mode”。独立模式的含义是，在 BusyBox 的 ash shell 中运行时，每个命令都将直接使用 BusyBox 内的 applet，而不管设置为 PATH 是什么。例如，诸如 ls、rm、chmod 等命令将不使用 PATH 中设置的内容（在 Android 的情况下，默认情况下分别为/system/bin/ls、/system/bin/rm 和/system/bin/chmod），而是直接调用内部 BusyBox applet。这确保脚本始终在可预测的环境中运行，并始终具有完整的命令套件，无论其运行在哪个 Android 版本上。要强制命令不使用 BusyBox，必须使用完整路径调用可执行文件。

在 Magisk 上下文中运行的每个 shell 脚本都将在启用了独立模式的 BusyBox 的 ash shell 中执行。对于第三方开发人员相关的内容，这包括所有启动脚本和模块安装脚本。

对于那些想要在 Magisk 之外使用此“独立模式”功能的人，有两种启用方式：

1. 设置环境变量`ASH_STANDALONE`为 1
   示例：`ASH_STANDALONE=1 /data/adb/magisk/busybox sh <script>`

2. 使用命令行选项切换：
   `/data/adb/magisk/busybox sh -o standalone <script>`

为确保所有随后执行的 sh shell 也在独立模式下运行，选项 1 是首选方法（这也是 Magisk 和 Magisk 应用程序在内部使用的方法），因为环境变量被继承到子进程。

# Magisk 模块

Magisk 模块是放置在`/data/adb/modules`目录下的一个文件夹，具有以下结构：

```markdown
/data/adb/modules
├── .
├── .
|
├── $MODID                  <--- 模块的ID作为文件夹名
│   │
│   │      *** 模块标识 ***
│   │
│   ├── module.prop         <--- 存储模块元数据的文件
│   │
│   │      *** 主要内容 ***
│   │
│   ├── system              <--- 如果不存在skip_mount，将会挂载此文件夹
│   │   ├── ...
│   │   ├── ...
│   │   └── ...
│   │
│   ├── zygisk              <--- 包含模块的Zygisk本机库的文件夹
│   │   ├── arm64-v8a.so
│   │   ├── armeabi-v7a.so
│   │   ├── x86.so
│   │   ├── x86_64.so
│   │   └── unloaded        <--- 如果存在，表示本机库不兼容
│   │
│   │      *** 状态标志 ***
│   │
│   ├── skip_mount          <--- 如果存在，Magisk将不会挂载系统文件夹
│   ├── disable             <--- 如果存在，模块将被禁用
│   ├── remove              <--- 如果存在，模块将在下一次重启时被移除
│   │
│   │      *** 可选文件 ***
│   │
│   ├── post-fs-data.sh     <--- 此脚本将在post-fs-data中执行
│   ├── service.sh          <--- 此脚本将在late_start service中执行
│   ├── uninstall.sh        <--- 当Magisk移除模块时将执行此脚本
│   ├── system.prop         <--- 此文件中的属性将由resetprop作为系统属性加载
│   ├── sepolicy.rule       <--- 额外的自定义sepolicy规则
│   │
│   │      *** 自动生成，切勿手动创建或修改 ***
│   │
│   ├── vendor              <--- 到$MODID/system/vendor 的符号链接
│ ├── product <--- 到$MODID/system/product的符号链接
│   ├── system_ext          <--- 到$MODID/system/system\*ext 的符号链接
│ │
│ │ \*\*\* 允许任何附加文件/文件夹 \_\*\*
│ │
│ ├── ...
│ └── ...
|
├── another_module
│ ├── .
│ └── .
├── .
├── .
```

## `module.prop`

这是`module.prop`的严格格式：

```plaintext
id=<string>
name=<string>
version=<string>
versionCode=<int>
author=<string>
description=<string>
updateJson=<url> (optional)
```

`id`必须匹配正则表达式：`^[a-zA-Z][a-zA-Z0-9._-]+$`。例如：✓ a_module, ✓ a.module, ✓ module-101，✗ a module, ✗ 1_module, ✗ -a-module。这是模块的唯一标识符，发布后不应更改。`versionCode`必须是整数，用于比较版本。`updateJson`应指向一个 URL，该 URL 下载 JSON 以提供信息，以便 Magisk 应用程序可以更新模块。其他未在上述提到的字段可以是任何单行字符串。确保使用 UNIX（LF）换行类型，而不是 Windows（CR+LF）或 Macintosh（CR）。

### 更新 JSON 格式：

```json
{
    "version": string,
    "versionCode": int,
    "zipUrl": url,
    "changelog": url
}
```

## Shell 脚本 (`*.sh`)

请阅读 Boot Scripts 部分，了解`post-fs-data.sh`和`service.sh`之间的区别。对于大多数模块开发者来说，如果只需要运行一个启动脚本，`service.sh`应该足够了。

在模块的所有脚本中，请使用`MODDIR=${0%/*}`获取模块的基本目录路径；请不要在脚本中将模块路径硬编码。如果启用了 Zygisk，环境变量`ZYGISK_ENABLED`将设置为 1。

## `system` 文件夹

您希望替换/注入的所有文件都应放在此文件夹中。此文件夹将递归合并到实际的/system 中：实际/system 中的现有文件将被模块的 system 中的文件替换，而模块的 system 中的新文件将添加到实际/system 中。

如果在任何文件夹中放置了名为`.replace`的文件，而不是合并其内容，该文件夹将直接替换实际系统中的文件。这对于替换整个文件夹非常方便。

如果要替换/vendor、/product 或/system_ext 中的文件，请将它们分别放在 system/vendor、system/product 和 system/system_ext 下。Magisk 将透明地处理这些分区是否在单独的分区中。

## Zygisk

Zygisk 是 Magisk 的一个功能，允许高级模块开发者在每个 Android 应用程序的进程中直接运行代码，而这些应用程序在专门化和运行之前。有关 Zygisk API 和构建 Zygisk 模块的详细信息，请查看[Zygisk Module Sample](https://github.com/topjohnwu/magisk-module-template)项目。

## `system.prop`

此文件遵循与`build.prop`相同的格式。每行由[key]=[value]组成。

## `sepolicy.rule`

如果您的模块需要一些额外的 sepolicy 修补程序，请将这些规则添加到此文件中。此文件中的每一行都将被视为策略语句。有关策略语句的格式的更多详细信息，请查看`magiskpolicy`的文档。

# Magisk 模块安装器

Magisk 模块安装器是打包为 zip 文件的 Magisk 模块，可以在 Magisk 应用程序或自定义恢复环境（如 TWRP）中刷入。最简单的 Magisk 模块安装器只是一个打包为 zip 文件的 Magisk 模块，除此之外还包括以下文件：

- `update-binary`：下载最新的`module_installer.sh`并将该脚本重命名/复制为`update-binary`
- `updater-script`：此文件应只包含字符串`#MAGISK`

模块安装器脚本将设置环境，从 zip 文件中提取模块文件到正确位置，然后完成安装过程，这对于大多数简单的 Magisk 模块来说应该足够了。

```markdown
module.zip
│
├── META-INF
│ └── com
│ └── google
│ └── android
│ ├── update-binary <--- 您下载的 module*installer.sh
│ └── updater-script <--- 应只包含字符串 "#MAGISK"
│
├── customize.sh <--- （可选，更多细节稍后）
│ 此脚本将由 update-binary 源代码
├── ...
├── ... /* 模块的其余文件 \_/
│
```

## 定制化

如果需要定制模块安装过程，可以选择在安装程序中创建一个名为 `customize.sh` 的脚本。此脚本将由模块安装程序脚本在所有文件被提取并应用默认权限和 secontext 之后进行源代码（不执行）。如果您的模块需要根据设备 ABI 进行额外的设置，或者您需要为一些模块文件设置特殊的权限/secontext，这将非常有用。

如果您希望完全控制和自定义安装过程，请在 `customize.sh` 中声明 `SKIPUNZIP=1` 以跳过所有默认安装步骤。通过这样做，`customize.sh` 将负责自行安装所有内容。

`customize.sh` 脚本在 Magisk 的 BusyBox ash shell 中运行，并启用了“独立模式”。以下变量和函数可用：

### 变量

- `MAGISK_VER`（字符串）：当前安装的 Magisk 版本字符串（例如 v20.0）
- `MAGISK_VER_CODE`（整数）：当前安装的 Magisk 版本代码（例如 20000）
- `BOOTMODE`（布尔值）：如果模块在 Magisk 应用程序中安装，则为 true
- `MODPATH`（路径）：应安装模块文件的路径
- `TMPDIR`（路径）：可以临时存储文件的地方
- `ZIPFILE`（路径）：模块的安装 zip
- `ARCH`（字符串）：设备的 CPU 架构。值为 arm、arm64、x86 或 x64
- `IS64BIT`（布尔值）：如果`$ARCH`是 arm64 或 x64，则为 true
- `API`（整数）：设备的 API 级别（Android 版本）（例如 23 表示 Android 6.0）

### 函数

- `ui_print <msg>`：将 `<msg>` 打印到控制台。请避免使用 'echo'，因为它不会显示在自定义恢复的控制台上。

- `abort <msg>`：将错误消息 `<msg>` 打印到控制台并终止安装。请避免使用 'exit'，因为它会跳过终止清理步骤。

- `set_perm <target> <owner> <group> <permission> [context]`：如果未指定 [context]，则默认为 "u:object_r:system_file:s0"。此函数是以下命令的缩写：

  ```sh
  chown owner.group target
  chmod permission target
  chcon context target
  ```

- `set_perm_recursive <directory> <owner> <group> <dirpermission> <filepermission> [context]`：如果未指定 [context]，则默认为 "u:object_r:system_file:s0"。此函数是以下伪代码的缩写：
  ```sh
  set_perm <directory> owner group dirpermission context
  for file in <directory>:
    set_perm file owner group filepermission context
  for dir in <directory>:
    set_perm_recursive dir owner group dirpermission context
  ```

为方便起见，您还可以在变量名 `REPLACE` 中声明要替换的文件夹列表。模块安装程序脚本将在 `REPLACE` 中列出的文件夹中创建 `.replace` 文件。例如：

```sh
REPLACE="
/system/app/YouTube
/system/app/Bloatware
"
```

上述列表将导致创建以下文件：`$MODPATH/system/app/YouTube/.replace` 和 `$MODPATH/system/app/Bloatware/.replace`。

## 注意事项

- 当使用 Magisk 应用程序下载模块时，`update-binary` 将被强制替换为最新的 `module_installer.sh`。请勿尝试在 `update-binary` 中添加任何自定义逻辑。
- 由于历史原因，请勿在模块安装程序 zip 中添加名为 `install.sh` 的文件。
- 请勿在 `customize.sh` 的末尾调用 `exit`。模块安装程序脚本必须在退出之前执行一些清理步骤。

# 启动脚本

在 Magisk 中，可以以两种不同的模式运行启动脚本：post-fs-data 和 late_start service 模式。

## post-fs-data 模式

这个阶段是**阻塞**的。在执行完成之前或经过 10 秒之前，引导过程会暂停。
脚本在任何模块被挂载之前运行。这允许模块开发人员在模块挂载之前动态调整它们的模块。
此阶段发生在 Zygote 启动之前，这几乎意味着 Android 中的所有东西。
**警告：使用 setprop 将导致引导过程死锁！请改用 resetprop -n <prop_name> <prop_value>。**
只有在必要的情况下才在此模式下运行脚本。

## late_start service 模式

这个阶段是**非阻塞**的。您的脚本与其余引导过程并行运行。
这是运行大多数脚本的推荐阶段。
在 Magisk 中，还有两种类型的脚本：通用脚本和模块脚本。

## 通用脚本

放置在`/data/adb/post-fs-data.d`或`/data/adb/service.d`
仅当将脚本设置为可执行（chmod +x script.sh）时才会执行
`post-fs-data.d`中的脚本在 post-fs-data 模式下运行，而`service.d`中的脚本在 late_start service 模式下运行。
在安装期间，模块不应添加通用脚本。

## 模块脚本

放置在模块的文件夹中
仅当模块启用时才会执行
`post-fs-data.sh`在 post-fs-data 模式下运行，而`service.sh`在 late_start service 模式下运行。
所有启动脚本将在 Magisk 的 BusyBox ash shell 中运行，并启用了“独立模式”。

## 根目录覆盖系统

由于在 system-as-root 设备上`/`是只读的，Magisk 提供了一个覆盖系统的系统，以使开发人员能够替换 rootdir 中的文件或添加新的\*.rc 脚本。此功能主要设计用于自定义内核开发者。

覆盖文件应放置在 boot 镜像 ramdisk 中的`overlay.d`文件夹中，并遵循以下规则：

- 在 overlay.d 中的每个\*.rc 文件（除了 init.rc）都将在 init.rc 之后读取并连接，如果在根目录中不存在，则将替换它。
- 可以通过与相同相对路径的位置的文件替换现有文件。
- 与不存在的文件相对应的文件将被忽略。
- 要添加可以在自定义\*.rc 脚本中引用的其他文件，请将它们添加到`overlay.d/sbin`中。上述 3 条规则不适用于此文件夹；相反，它们将直接复制到 Magisk 的内部 tmpfs 目录中（过去总是/sbin）。

从 Android 11 开始，/sbin 文件夹可能不再存在，在这种情况下，Magisk 将使用/debug_ramdisk。当 magiskinit 将其注入到 init.rc 中时，您的*.rc 脚本中的每个`${MAGISKTMP}`模式的出现都将被替换为 Magisk tmpfs 文件夹。在 Android 11 之前的设备上，`${MAGISKTMP}`将简单地被替换为/sbin，因此在引用这些附加文件时，永远不要将/sbin 硬编码到*.rc 脚本中。

以下是如何使用自定义\*.rc 脚本设置 overlay.d 的示例：

```markdown
ramdisk
│
├── overlay.d
│ ├── sbin
│ │ ├── libfoo.ko <--- 这两个文件将被复制
│ │ └── myscript.sh <--- 到 Magisk 的 tmpfs 目录
│ ├── custom.rc <--- 此文件将被注入到 init.rc 中
│ ├── res
│ │ └── random.png <--- 此文件将替换/res/random.png
│

└── new*file <--- 此文件将被忽略，因为
│ /new_file 不存在
├── res
│ └── random.png <--- 此文件将被/overlay.d/res/random.png 替换
├── ...
├── ... /* 剩余的 initramfs 文件 \_/
│
```

以下是 custom.rc 的示例：

```markdown
# 使用${MAGISKTMP}引用 Magisk 的 tmpfs 目录

on early-init
setprop sys.example.foo bar
insmod ${MAGISKTMP}/libfoo.ko
start myservice

service myservice ${MAGISKTMP}/myscript.sh
oneshot
```

# magisk 底层技术原理

Magisk 的底层技术原理可以分为两部分：

- **Systemless Root:** Magisk 通过一种特殊的机制来修改系统，这种机制不会对系统文件造成任何修改。具体来说，Magisk 会在启动时修改 init 进程，将 init 进程的入口点重定向到 Magisk 的 init 模块。Magisk 的 init 模块会在启动时加载 Magisk 的核心模块，并将这些模块注入到系统的关键位置。

- **模块管理:** Magisk 提供了一个模块管理器，允许用户安装和管理第三方模块。模块可以用来添加新功能或修改系统行为。Magisk 的模块管理器采用了一种特殊的机制来加载模块，这种机制不会对系统文件造成任何修改。具体来说，Magisk 会在启动时加载 Magisk 的模块管理器，模块管理器会在启动时加载用户安装的模块。

**Systemless Root**

Magisk 的 Systemless Root 机制主要包括以下步骤：

1. 在启动时，Magisk 会修改 init 进程，将 init 进程的入口点重定向到 Magisk 的 init 模块。
2. Magisk 的 init 模块会在启动时加载 Magisk 的核心模块。
3. Magisk 的核心模块会将以下模块注入到系统的关键位置：
   - **Magisk Hide:** 用于隐藏 Root 状态，使不支持 Root 的应用程序可以正常运行。
   - **MagiskSU:** 用于提供 Root 权限，允许用户执行 Root 操作。
   - **Magisk Modules:** 用于加载第三方模块。

**模块管理**

Magisk 的模块管理机制主要包括以下步骤：

1. 用户使用 Magisk 的模块管理器安装第三方模块。
2. Magisk 的模块管理器会在启动时加载用户安装的模块。
3. Magisk 的模块会在启动时将自己注入到系统的关键位置。

**安全性**

Magisk 采用了多种安全措施来保护系统安全，包括：

- **SELinux 补丁：**Magisk 会在启动时为 SELinux 添加一个新的模块，该模块会允许 Magisk 的模块绕过 SELinux 的安全检查。
- **启动时认证/dm-verity/强制加密移除：**Magisk 可以移除启动时认证、dm-verity 和强制加密等安全功能，以便用户可以自由修改系统。
- **模块签名验证：**Magisk 会对第三方模块进行签名验证，以防止恶意模块被安装。

**与其他 Root 工具的区别**

Magisk 与其他 Root 工具的主要区别在于，Magisk 采用了 Systemless Root 机制，不会对系统文件造成任何修改。因此，Magisk 可以与大多数 Android 应用程序兼容，包括那些不支持 Root 的应用程序。

此外，Magisk 还提供了模块管理功能，允许用户安装和管理第三方模块。模块可以用来添加新功能或修改系统行为。

## init 进程

init 进程是 Linux 系统启动时启动的第一个用户进程，它负责启动和停止系统上的所有其他进程。init 进程始终分配的进程 ID (PID) 为 1，通俗地说，当你按下电源按钮时，你的系统将首先寻找引导加载程序（ Linux grub），然后它会尝试启动内核。但内核本身无法启动所有进程，因此它将启动第一个（或父）进程，称为 init（“初始化”的意思），PID 为“ 1 ”（进程标识符按顺序分配）。

init 进程的具体任务包括：

- 加载系统配置文件，例如 /etc/inittab 和 /etc/rc.local。
- 启动系统守护进程，例如 getty、syslogd、crond 等。
- 启动用户进程，例如 shell、应用程序等。

init 进程的启动流程如下：

1. 内核启动完成后，会启动 init 进程。
2. init 进程会加载系统配置文件，并根据配置文件启动系统守护进程。
3. 系统守护进程会启动用户进程。

init 进程是 Linux 系统中最重要的进程之一，它负责整个系统的启动和运行。

以下是 init 进程的一些常用命令：

- **init:** 启动 init 进程。
- **init 0:** 关闭系统。
- **init 6:** 重启系统。
- **init q:** 进入单用户模式。

在 Android 系统中，init 进程是由 init.rc 文件来配置的。init.rc 文件是一个 shell 脚本，它包含了 init 进程需要执行的所有命令。

## 将 init 进程的入口点重定向到 Magisk 的 init 模块

Magisk 将 init 进程的入口点重定向到 Magisk 的 init 模块，是通过修改 init.rc 文件来实现的。

init.rc 文件是一个 shell 脚本，它包含了 init 进程需要执行的所有命令。Magisk 会在 init.rc 文件中添加以下命令：

```
on init
    # 将 init 进程的入口点重定向到 Magisk 的 init 模块
    setprop init_target /system/bin/magiskinit
```

该命令会将 init_target 变量的值设置为 /system/bin/magiskinit。init 进程在启动时会读取 init.rc 文件，并根据 init_target 变量的值来确定自己的入口点。因此，当 init_target 变量的值设置为 /system/bin/magiskinit 时，init 进程的入口点就会被重定向到 Magisk 的 init 模块。

Magisk 的 init 模块会在启动时加载 Magisk 的核心模块。Magisk 的核心模块会将 Magisk 的其他模块注入到系统的关键位置。因此，通过将 init 进程的入口点重定向到 Magisk 的 init 模块，Magisk 就可以实现 Systemless Root。

具体来说，Magisk 的 init 模块会在启动时执行以下步骤：

1. 加载 Magisk 的核心模块。
2. 将 Magisk 的其他模块注入到系统的关键位置。
3. 启动系统守护进程和用户进程。

通过这些步骤，Magisk 就可以在系统启动时完成 Root 操作，而不会对系统文件造成任何修改。

## 具体步骤

从设备加电到 magiskinit 进程启动完成，具体经过了以下步骤：

1. 设备加电后，会启动引导加载程序。引导加载程序会加载内核。
2. 内核启动完成后，会启动 init 进程。init 进程是 Linux 系统启动时启动的第一个用户进程，它负责启动和停止系统上的所有其他进程。
3. init 进程会读取 init.rc 文件，并根据 init_target 变量的值来确定自己的入口点。当 init_target 变量的值设置为 /system/bin/magiskinit 时，init 进程的入口点就会被重定向到 Magisk 的 init 模块。
4. Magisk 的 init 模块会在启动时加载 Magisk 的核心模块。Magisk 的核心模块会将 Magisk 的其他模块注入到系统的关键位置。
5. Magisk 的其他模块会在启动时执行以下步骤：
   - **Magisk Hide：**用于隐藏 Root 状态，使不支持 Root 的应用程序可以正常运行。
   - **MagiskSU：**用于提供 Root 权限，允许用户执行 Root 操作。
   - **Magisk Modules：**用于加载第三方模块。
6. Magisk 的 init 模块会启动系统守护进程和用户进程。

具体来说，从设备加电到 magiskinit 进程启动完成，可以分为以下几个阶段：

**阶段 1：引导加载程序启动**

设备加电后，会启动引导加载程序。引导加载程序是负责启动操作系统的软件。引导加载程序会加载内核，并将控制权交给内核。

**阶段 2：内核启动**

内核是操作系统的核心部分。内核负责管理硬件资源，并为应用程序提供运行环境。内核启动完成后，会启动 init 进程。

**阶段 3：init 进程启动**

init 进程是 Linux 系统启动时启动的第一个用户进程。init 进程负责启动和停止系统上的所有其他进程。init 进程会读取 init.rc 文件，并根据 init_target 变量的值来确定自己的入口点。当 init_target 变量的值设置为 /system/bin/magiskinit 时，init 进程的入口点就会被重定向到 Magisk 的 init 模块。

**阶段 4：magiskinit 模块启动**

Magisk 的 init 模块会在启动时加载 Magisk 的核心模块。Magisk 的核心模块会将 Magisk 的其他模块注入到系统的关键位置。

**阶段 5：Magisk 模块启动**

Magisk 的其他模块会在启动时执行以下步骤：

    * **Magisk Hide：**用于隐藏 Root 状态，使不支持 Root 的应用程序可以正常运行。
    * **MagiskSU：**用于提供 Root 权限，允许用户执行 Root 操作。
    * **Magisk Modules：**用于加载第三方模块。

**阶段 6：系统守护进程和用户进程启动**

Magisk 的 init 模块会启动系统守护进程和用户进程。系统守护进程负责维护系统的运行，用户进程则是用户可以直接使用的应用程序。

通过以上步骤，magiskinit 进程就可以启动完成，并完成 Root 操作。
