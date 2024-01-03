1. **`apt-get install`：**
   安装一个或多个软件包。

   ```bash
   sudo apt-get install package_name
   ```

2. **`apt-get remove`：**
   卸载一个软件包，保留其配置文件。

   ```bash
   sudo apt-get remove package_name
   ```

3. **`apt-get purge`：**
   卸载一个软件包，并删除其配置文件。

   ```bash
   sudo apt-get purge package_name
   ```

4. **`apt-get upgrade`：**
   升级系统中所有已安装的软件包。

   ```bash
   sudo apt-get upgrade
   ```

5. **`apt-get update`：**
   更新本地软件包列表，获取可用更新的信息。

   ```bash
   sudo apt-get update
   ```

6. **`apt-get dist-upgrade`：**
   升级系统到新的发行版，处理更复杂的依赖关系。

   ```bash
   sudo apt-get dist-upgrade
   ```

7. **`apt-get autoremove`：**
   移除不再需要的依赖项。

   ```bash
   sudo apt-get autoremove
   ```

8. **`apt-get autoclean`：**
   清理缓存，删除已经过期的软件包。

   ```bash
   sudo apt-get autoclean
   ```

9. **`apt-get clean`：**
   清理缓存，删除所有下载的软件包。

   ```bash
   sudo apt-get clean
   ```

10. **`apt-get check`：**
    检查软件包的完整性。

    ```bash
    sudo apt-get check
    ```

11. **`apt-get show`：**
    显示软件包的详细信息。

    ```bash
    apt-cache show package_name
    ```

12. **`apt-get search`：**
    在软件包列表中搜索特定的软件包。

    ```bash
    apt-cache search search_term
    ```