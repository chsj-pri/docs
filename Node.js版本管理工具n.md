1. **安装 `n`**：
   ```bash
   npm install -g n
   ```

2. **安装Node.js版本**：
   安装最新版本的Node.js：
   ```bash
   n latest
   ```

   安装特定版本：
   ```bash
   n 14.17.6
   ```

3. **查看已安装的版本**：
   列出已安装的Node.js版本：
   ```bash
   n
   ```

4. **选择活动的版本**：
   ```bash
   n use <version>
   ```

   例如：
   ```bash
   n use 14.17.6
   ```

5. **卸载版本**：
   ```bash
   n rm <version>
   ```

   例如：
   ```bash
   n rm 14.17.6
   ```

6. **查看可用的Node.js版本**：
   列出可用稳定版和LTS版本：
   ```bash
   n lts
   ```
7. **更新 `n`**：
   ```bash
   n latest
   ```

8. **升级 npm**：
   ```bash
   npm i npm -g
   ```

8. **查看node.js和npm版本号**：
   ```bash
   node -v
   npm -v
   ```