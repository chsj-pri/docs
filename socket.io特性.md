### 特性

1. **自动回退机制：** Socket.IO 提供了自动回退机制，当 WebSocket 不可用时，它会自动选择其他传输机制，如长轮询（long-polling），以确保在不同环境下仍能够实现实时通信。这使得应用在各种网络条件下更加鲁棒。

2. **跨浏览器和跨平台支持：** Socket.IO 解决了一些 WebSocket API 在不同浏览器和平台上的实现差异，提供了更一致的开发体验，同时支持 Web、iOS 和 Android。

3. **房间和命名空间：** Socket.IO 允许你将连接组织成房间或命名空间，以便更好地管理和分组连接，这在多用户应用中尤为重要。通过这种机制，你可以发送消息给特定的房间或命名空间，实现更精细的消息控制。

4. **可靠的连接和重新连接：** Socket.IO 提供了内置的连接中断和重新连接机制，使应用程序在网络波动或中断的情况下更具可靠性，无需手动实现这些逻辑。

5. **多语言支持：** Socket.IO 不仅提供了 JavaScript 的服务器和客户端库，还支持其他语言的客户端库，如 Python、Java 和 Swift。这使得你可以在不同的技术栈中轻松地实现实时通信。

6. **事件封装：** Socket.IO 使用事件驱动的编程模型，使得消息的发送和接收更具可读性和可维护性。你可以定义和监听不同的事件，从而更清晰地表达应用程序中的各种交互。

7. **中间件支持：** Socket.IO 支持中间件，允许你在消息传递过程中执行自定义的逻辑，增加了灵活性。

8. **广泛的社区支持：** 由于 Socket.IO 拥有庞大的开发者社区，你可以更容易地找到相关文档、教程和解决方案，加速开发过程。

### 可靠的连接和重新连接

1. **连接超时：** 在建立连接时，Socket.IO 允许你设置连接的超时时间。如果连接在指定的时间内没有建立成功，Socket.IO 将触发一个超时事件，你可以在该事件中执行相应的处理逻辑。

```javascript
const socket = io("http://example.com", {
  timeout: 5000, // 5 seconds timeout
});
```

2. **连接中断检测：** Socket.IO 会定期发送心跳（heartbeat）以检测连接的状态。如果服务器在一段时间内没有收到来自客户端的心跳，就会认为连接中断。这个时间间隔可以通过配置进行调整。

```javascript
const socket = io("http://example.com", {
  pingTimeout: 60000, // 60 seconds without a pong packet will trigger a disconnection
});
```

3. **重新连接：** 如果连接中断，Socket.IO 将尝试自动重新连接。你可以配置重新连接的选项，例如尝试的次数和尝试之间的延迟。这有助于在瞬时的网络问题之后，尽快地恢复连接。

```javascript
const socket = io("http://example.com", {
  reconnection: true, // 是否自动重新连接
  reconnectionAttempts: 5, // 尝试重新连接的次数
  reconnectionDelay: 1000, // 尝试重新连接之间的延迟时间（毫秒）
  reconnectionDelayMax: 5000, // 重新连接延迟的最大值
});
```

4. **重新连接事件：** Socket.IO 触发重新连接事件，你可以监听该事件并执行相应的逻辑。例如，在重新连接成功后，你可能需要重新订阅一些频道或获取最新的数据。

```javascript
socket.on("reconnect", (attemptNumber) => {
  console.log(`Reconnected after ${attemptNumber} attempts`);
});
```

### 命名空间（Namespace）：

- **定义命名空间：** 在 Socket.IO 中，可以通过创建命名空间来隔离不同的功能或模块。命名空间可以理解为一个虚拟的通信管道，用于将相关的连接组织在一起。

  ```javascript
  // 创建一个命名空间为 "/chat" 的命名空间
  const chatNamespace = io.of("/chat");
  ```

- **命名空间事件：** 命名空间可以拥有自己的事件，这些事件与全局事件是相互独立的。在客户端和服务器端，你可以监听和触发特定于命名空间的事件。

  ```javascript
  // 在命名空间中监听客户端消息事件
  chatNamespace.on("connection", (socket) => {
    console.log("Client connected to chat namespace");

    // 发送消息给连接到该命名空间的所有客户端
    chatNamespace.emit("message", "Welcome to the chat room!");
  });
  ```

### 房间（Room）：

- **将连接加入房间：** 通过将连接加入房间，你可以将连接分类到不同的逻辑组，以便有选择性地向特定组发送消息。

  ```javascript
  // 将连接加入名为 "room-1" 的房间
  socket.join("room-1");
  ```

- **房间事件：** 你可以为房间定义特定的事件，以便向房间内的所有连接发送消息。

  ```javascript
  // 发送消息给房间内的所有连接
  io.to("room-1").emit("message", "Hello, room-1!");
  ```

- **离开房间：** 如果连接离开了某个房间，就不再接收该房间的消息。

  ```javascript
  // 将连接从名为 "room-1" 的房间中移除
  socket.leave("room-1");
  ```

Socket.IO 中的房间（Rooms）和命名空间（Namespaces）是两个用于组织和管理连接的概念，它们有一些联系但也有一些区别。

### 命名空间（Namespace）：

- **联系：**

  - 命名空间是用于隔离不同功能或模块的连接的虚拟通信管道。它允许将相关的连接组织在一起，以便更好地组织和管理通信。
  - 在客户端和服务器端，你可以通过 `io.of(namespace)` 创建命名空间，并在该命名空间下监听和触发事件。

- **区别：**
  - 命名空间在连接的基础上引入了逻辑上的分组，但连接仍然是在全局范围内唯一的。在不同的命名空间中，可以有相同的连接 ID，它们不会相互干扰。
  - 通过命名空间，你可以更好地将不同的功能或模块划分开来，以实现更有组织性的消息传递。

### 房间（Room）：

- **联系：**

  - 房间是用于将连接分类到不同逻辑组的概念，以便有选择性地向特定组发送消息。连接可以加入一个或多个房间，以便接收特定房间的消息。

- **区别：**
  - 房间是在命名空间内部的一种逻辑分组方式。一个房间只能存在于一个命名空间中。房间提供了更细粒度的消息控制，使得你可以向特定的房间发送消息，而不是向整个命名空间。

### 例子：

```javascript
// 创建命名空间 "/chat"
const chatNamespace = io.of("/chat");

// 在 "/chat" 命名空间中监听连接事件
chatNamespace.on("connection", (socket) => {
  console.log("Client connected to chat namespace");

  // 将连接加入名为 "room-1" 的房间
  socket.join("room-1");

  // 发送消息给连接到 "/chat" 命名空间的所有客户端
  chatNamespace.emit("message", "Welcome to the chat room!");

  // 发送消息给 "room-1" 房间内的所有客户端
  chatNamespace.to("room-1").emit("message", "Hello, room-1!");
});
```

### 鉴权

#### 1. 客户端：

在客户端，你可以使用 Socket.IO 的 `emit` 方法在连接建立时发送认证信息。这可以在连接建立后的某个时刻执行，例如在用户登录后：

```javascript
const socket = io("http://your-server-domain");

// 假设 userToken 是用户登录后获得的认证令牌
const userToken = "user_authentication_token";

// 发送认证信息
socket.emit("authenticate", { token: userToken });
```

#### 2. 服务器端：

在服务器端，你需要监听连接事件，并在连接建立时验证客户端发送的认证信息。这可以通过监听 `'connection'` 事件和自定义的 `'authenticate'` 事件来完成：

```javascript
const io = require("socket.io")(httpServer);

io.on("connection", (socket) => {
  console.log("A user connected");

  // 监听认证事件
  socket.on("authenticate", (data) => {
    // 假设 validateToken 是一个用于验证令牌的函数
    if (validateToken(data.token)) {
      console.log("Authentication successful");
      // 执行后续操作，如将连接加入特定房间等
    } else {
      console.log("Authentication failed");
      // 断开连接或执行其他处理
      socket.disconnect(true);
    }
  });
});
```

### java

```java
import com.corundumstudio.socketio.*;
import com.corundumstudio.socketio.listener.*;
import io.netty.util.internal.logging.InternalLoggerFactory;
import io.netty.util.internal.logging.Slf4JLoggerFactory;

public class SocketIOServerExample {

    public static void main(String[] args) throws InterruptedException {
        InternalLoggerFactory.setDefaultFactory(Slf4JLoggerFactory.INSTANCE);

        // 配置 Socket.IO 服务器
        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(9092);

        final SocketIOServer server = new SocketIOServer(config);

        // 添加连接监听器
        server.addConnectListener(new ConnectListener() {
            @Override
            public void onConnect(SocketIOClient client) {
                System.out.println("Client connected: " + client.getSessionId());

                // 向连接的客户端发送消息
                client.sendEvent("welcome", "Welcome to the server!");
            }
        });

        // 添加消息监听器
        server.addMessageListener(new DataListener<String>() {
            @Override
            public void onData(SocketIOClient client, String data, AckRequest ackSender) {
                System.out.println("Received message from client: " + data);

                // 向所有连接的客户端广播消息
                server.getBroadcastOperations().sendEvent("broadcast", "Server broadcast: " + data);

                // 向特定的客户端发送消息
                sendToSpecificClient(server, "sessionId", "Hello, specific client!");
            }
        });

        // 启动服务器
        server.start();

        // 等待服务器关闭
        Thread.sleep(Integer.MAX_VALUE);

        // 关闭服务器
        server.stop();
    }

    private static void sendToSpecificClient(SocketIOServer server, String sessionId, String message) {
        SocketIOClient client = server.getClient(UUID.fromString(sessionId));
        if (client != null) {
            client.sendEvent("specificMessage", message);
        } else {
            System.out.println("Client with sessionId " + sessionId + " not found.");
        }
    }
}
```

### 参考

- https://github.com/miguelgrinberg/python-socketio
- https://github.com/mrniko/netty-socketio
- https://github.com/trinopoty/socket.io-server-java
- https://github.com/socketio/socket.io-client-java
- https://github.com/socketio/socket.io
- https://github.com/socketio/socket.io-client
