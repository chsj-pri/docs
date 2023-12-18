### 安装-国内源

##### 完整版安装脚本

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

##### 精简版极速安装脚本

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

##### Homebrew 卸载脚本

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)"

```

### 常用命令

##### 安装任意包，例如 brew install node

```bash

    brew install appName

```

##### 卸载任意包

```bash

    brew uninstall appName
	// 例如 brew uninstall git
```

##### 查询可用包

```bash

    brew search appName[当不知道具体名字时-这里可直接用关键字搜索]

```

##### 查看任意包信息

```bash

    brew info appName

```

##### 更新 Homebrew

```bash

    brew update

```

##### 查看 Homebrew 版本

```bash

    brew -v

```

##### Homebrew 帮助信息

```bash

    brew -h

```

##### 列出已安装的软件

```bash

    brew list
	// 或者  brew ls
```

##### 用浏览器打开 brew 的官方网站

```bash

    brew home

```

##### 显示包依赖

```bash

    brew deps

```

### 常见问题：

1. 注意 ⚠️ 在 Mac OS X 10.11 系统以后，/usr/local/等系统目录下的文件读写是需要系统 root 权限的，以往的 Homebrew 安装如果没有指定安装路径，会默认安装在这些需要系统 root 用户读写权限的目录下，导致有些指令需要添加 sudo 前缀来执行，比如升级 Homebrew 需要：
   sudo brew update
2. 如果你不想每次都使用 sudo 指令，你有两种方法可以选择:

- 对/usr/local 目录下的文件读写进行 root 用户授权
  ```base
  sudo chown -R $USER /usr/local
  //	例如：sudo chown -R gaojun /usr/local
  ```
- （推荐）安装 Homebrew 时对安装路径进行指定，直接安装在不需要系统 root 用户授权就可以自由读写的目录下
  <install path> -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
