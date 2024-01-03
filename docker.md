## 命令

```bash
docker version
docker info
docker ps -a
docker run -d -p 80:80 nginx                     # 启动一个容器
docker run --name dev -it ubuntu
docker run -d --name nginx_test nginx           # -d 后台运行
docker run -v ~/Developer:/app ubuntu
docker run -d --name dev -v ~/Developer:/app ubuntu
docker start dev
docker attach dev
docker exec -it dev /bin/bash
docker exec -it -u root dev /bin/bash
docker build -t dev:latest .
docker run -d -it -v ~/Developer:/app -p 8000:8000 -p 8001:8001 -p 8002:8002 -p 8003:8003 --name dev ubuntu
docker container update --publish-add 8080:8080 dev
docker search ubuntu                             # 搜索镜像
docker pull ubuntu                               # 获取镜像
docker pull ubuntu:18.04
docker image list                                # 查看镜像列表
docker pull index.tenxcloud.com/tenxcloud/httpd  # 拉第三方镜像
docker image save ubuntu > docker-ubuntu.tar.gz  # 导出镜像
docker image rm ubuntu:latest                    # 删除镜像
docker image load -i docker-ubuntu.tar.gz        # 导入镜像
docker image inspect ubuntu                      # 查看镜像的详细信息
docker container ls                              # 查看正在运行的容器
docker container inspect 容器名称/id              # 查看容器详细信息
docker stop 容器名称/id                           # 停止容器
docker container kill 容器名称/id                 # 停止容器
docker rm 容器名称/id                             # 删除容器
docker rm dev
docker rm -f dev
docker login
docker tag my-application myusername/my-application
docker push myusername/my-application
docker commit my_container my_custom_image:latest
docker-compose version
```

## Dockerfile

```
FROM：基于一个基础镜像来修改
WORKDIR：指定当前工作目录
COPY：把容器外的内容复制到容器内
EXPOSE：声明当前容器要访问的网络端口，比如这里起服务会用到 8080
RUN：在容器内执行命令
CMD：容器启动的时候执行的命令
```

```
FROM node:10
WORKDIR /app
COPY . /app
EXPOSE 8080
RUN npm install http-server -g
RUN npm install && npm run build
CMD http-server ./dist
```

```
# build stage
FROM node:10 AS build_image
WORKDIR /app
COPY . /app
EXPOSE 8080
RUN npm install && npm run build

# production stage
FROM node:10
WORKDIR /app
COPY --from=build_image /app/dist ./dist
RUN npm i -g http-server
CMD http-server ./dist
```

```
# node镜像仅仅是用来打包文件
FROM node:alpine as builder
ENV PROJECT_ENV production
ENV NODE_ENV production
COPY package*.json /app/
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
COPY . /app
RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /app/build
```

```bash
# 打包镜像 -f 指定使用Dockerfile.multi进行构建
docker build -t deepred5/react-app-multi .  -f Dockerfile.multi
# 启动容器
docker run -d --name my-react-app-multi  -p 8889:80 deepred5/react-app-multi
#访问 http://localhost:8889 即可看到页面

# 查看镜像大小
docker images deepred5/react-app-multi
docker images deepred5/react-app
```

## Dockerfile 命令列表

Dockerfile 是一个文本文件，其中包含一系列用于构建 Docker 镜像的指令。以下是一些常见的 Dockerfile 命令：

1. **`FROM`：**
   指定基础镜像，构建新镜像的起点。

   ```Dockerfile
   FROM ubuntu:latest
   ```

2. **`MAINTAINER`：**
   设置镜像的作者信息（已经过时，建议使用 `LABEL` 代替）。

   ```Dockerfile
   MAINTAINER Your Name <your.email@example.com>
   ```

3. **`LABEL`：**
   为镜像添加元数据，包括作者、描述等信息。

   ```Dockerfile
   LABEL maintainer="Your Name <your.email@example.com>" \
         version="1.0" \
         description="This is a custom Docker image."
   ```

4. **`RUN`：**
   在镜像构建过程中执行命令。

   ```Dockerfile
   RUN apt-get update && apt-get install -y python3
   ```

5. **`COPY`：**
   将文件或目录从构建环境复制到镜像中。

   ```Dockerfile
   COPY ./app /app
   ```

6. **`ADD`：**
   类似于 `COPY`，但支持 URL 和解压缩。

   ```Dockerfile
   ADD https://example.com/file.tar.gz /opt/
   ```

7. **`WORKDIR`：**
   设置工作目录，后续命令将在这个目录中执行。

   ```Dockerfile
   WORKDIR /app
   ```

8. **`ENV`：**
   设置环境变量。

   ```Dockerfile
   ENV LANG C.UTF-8
   ```

9. **`EXPOSE`：**
   声明容器运行时监听的端口。

   ```Dockerfile
   EXPOSE 80
   ```

10. **`CMD`：**
    定义容器启动时要运行的命令。

    ```Dockerfile
    CMD ["python", "app.py"]
    ```

11. **`ENTRYPOINT`：**
    设置容器启动时运行的命令。

    ```Dockerfile
    ENTRYPOINT ["python", "app.py"]
    ```

12. **`VOLUME`：**
    创建一个挂载点，用于容器和主机之间的数据卷。

    ```Dockerfile
    VOLUME /data
    ```

13. **`USER`：**
    指定运行后续命令的用户。

    ```Dockerfile
    USER appuser
    ```

## Networking

```bash
# 创建一个app-test网络
docker network create app-test
docker run -d --name redis-app --network app-test  -p 6389:6379 redis
docker run -it --name node-app --network app-test node:11 /bin/bash
redis-app #node-app容器里，然后ping
```

## 总结 Docker 命令

```bash
#启动容器
docker run -d --name nginx_test -p 8080:80 -v /data/nginx:/opt/nginx/html nginx

# 参数：
# -d #后台运行
# -p #端口映射，-p 8080:80， 8080 表示宿主机端口，80 表示容器端口
# -v #目录映射，-v /data/nginx:/opt/nginx，/data/nginx 表示宿主机目录，/opt/nginx，/opt/nginx 表示容器目录
# --name #设置容器名称
# nginx #容器镜像
# 查看正在运行的容器
# docker ps
# 参数：
# -a #查看运行的所有容器，包括运行状态和停止状态的容器

# 启动、停止、重启容器
docker start nginx_test #启动 Nginx 容器
docker stop nginx_test #停止 Nginx 容器
docker restart nginx_test #重启 Nginx 容器

# 进入容器
docker exec -it nginx_test bash
# 参数：
# -it #打开终端交互（进入容器操作）

# 删除运行的容器
docker rm -f nginx_test

# 查看容器镜像
docker images

# 删除容器镜像
docker rmi nginx:latest
docker rmi d6454d54b3d9 (IMAGE ID)

# 下载容器镜像
docker search nginx
docker pull nginx

# 镜像导出为文件
docker save nginx:latest nginx.tar

# 从文件导入镜像
docker load < nginx.tar

# 编译镜像
docker build -t nginx:v1 .
```

## 容器编排 docker-compose
1. docker-copose 介绍
docker-compose 是一个容器编排工具（自动化部署、管理）;
它用来在单台 Linux 服务器上运行多个 Docker 容器;
docker-compose 使用 YAML 文件来配置所有需要运行的 Docker 容器，该 YAML 文件的默认名称为 docker-compose.yml

2. docker-compose 安装
```bash
curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose version
```

3. 使用 docker-compose 启动一个容器
以下是 docker-compose.yml 的内容
```
version: '2.1'
    services:
        nginx:
            image: nginx:latest
            container_name: nginx_test
            ports: - 8080:80
            volumes: - /opt/nginx:/opt/nginx/html
```

参数：
compose 文件格式的版本，恒定为 2.1
services 标签下可以定义多个类似 nginx 这样的服务
container_name 服务定义， nginx_test 是容器的名称
image nginx 容器所使用的镜像
ports 定义端口映射，本例将容器内的 80 端口映射到宿主机的 8080 端口
volumes 定义目录映射，本例将容器内的 /opt/nginx/html 目录映射到宿主机的 /opt/nginx 目录


4. 启动容器
在 docker-compose 所在目录执行
```bash
docker compose up -d
```
参数：
up 表示启动
-d 表示后台运行
-f 指定 docker-compose 文件位置 docker-compose -f /root/docker-compose/docker-compose.yml up -d

5. Dockerdocker-compose 命令总结
在 docker-compose 所在目录执行

```bash
# 启动容器
docker-compose up -d

# 停止容器
docker-compose down

# 重启容器
docker-compose restart

# 重载 docker-compose.yml
docker-compose up --force-recreate -d
```

6. docker-compose 创建多个容器
使用 docker-compose 启动 Nginx 和 Redis 两个容器：
docker-compose.yml 内容如下：
```
version: '2.1'
services:
    nginx:
        image: nginx:latest
        container_name: nginx_host1
        ports: - 8081:80
        volumes: - /opt/nginx:/opt/nginx/html
        networks: - host1-network
    redis:
        image: redis:latest
        container_name: redis_host1
        ports: - 63790:6379
        networks: - host1-network

networks:
    host1-network:
        driver: bridge
        ipam:
            driver: default
            config: - subnet: 192.168.11.0/24
            gateway: 192.168.11.254
```
参数：
networks 定义容器网络，host1-network 为定义的网络名称，
config 网络配置，subnet 代表网段，gateway 代表网关。

执行创建命令
```docker-compose up -d```
可以看到成功创建了 Nginx 和 Redis 两个容器

## 参考

- https://hub.docker.com/
- https://zhuanlan.zhihu.com/p/405329231
- https://blog.csdn.net/weixin_63133658/article/details/134533272
- https://zhuanlan.zhihu.com/p/405329231
- https://zhuanlan.zhihu.com/p/625093534
- https://www.cnblogs.com/Can-daydayup/p/15395980.html
- https://zhuanlan.zhihu.com/p/643220942
- https://zhuanlan.zhihu.com/p/646016466
- https://zhuanlan.zhihu.com/p/411857355

- https://zhuanlan.zhihu.com/p/635275651
- https://learn.microsoft.com/zh-cn/windows/wsl/install-manual
- https://zhuanlan.zhihu.com/p/407555801
- https://zhuanlan.zhihu.com/p/84894157

- https://docs.docker.com/engine/reference/builder

## 示例

```
# 使用基础的 Ubuntu 镜像
FROM ubuntu:latest

# 更新包列表并安装必要的软件
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    nodejs \
    npm

# 安装 FastAPI 和 MoviePy
RUN pip3 install fastapi moviepy

# 设置工作目录
WORKDIR /app

# 拷贝你的应用代码到容器中
COPY . /app

# 暴露 FastAPI 默认端口
EXPOSE 8000

# 启动 FastAPI 服务器
CMD ["uvicorn", "your_fastapi_app:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t my_image .
docker run -it -p 8000:8000 my_image
docker run -it -v ～/dev:/app my_image
```
