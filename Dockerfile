# 基于哪个镜像
FROM java
# 拷贝文件到容器
ADD book-sale-system-1.0-SNAPSHOT.jar app.jar
RUN bash -c 'touch /app.jar'
# 开放端口
EXPOSE 8090
# 配置容器启动后执行的命令
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]