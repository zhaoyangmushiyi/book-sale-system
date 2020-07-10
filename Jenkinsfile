pipeline {
    agent {
        label 'master'
    }

    environment {
        APP_NAME = "book-sale-system"
        APP_PORT = "8090"
        REPO_URL = "git@github.com:zhaoyangmushiyi/book-sale-system.git"
        BRANCH_NAME = "master"
        PARAM = "--net=host"
    }

    stages {
        stage('获取代码') {
            steps {
                git([url: "${REPO_URL}", branch: "${BRANCH_NAME}"])
            }
        }

        stage('编译代码') {
            steps {
                withMaven(maven: 'maven 3.6') {
                    sh "mvn -U -am clean package -DskipTests"
                }
            }
        }

        stage('构建镜像') {
            steps {
                sh "cp ./target/*.jar ./"
                sh "docker build -t ${APP_NAME}/${BRANCH_NAME}:1.0-SNAPSHOT ."
            }
        }

        stage('运行镜像') {
            steps {
                sh "if docker ps -a | grep ${APP_NAME}-${BRANCH_NAME};\n then docker rm -f ${APP_NAME}-${BRANCH_NAME}\n echo Remove Docker Container: ${APP_NAME}-${BRANCH_NAME}\n fi"
                sh "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${APP_NAME}-${BRANCH_NAME} ${PARAM} ${APP_NAME}/${BRANCH_NAME}:1.0-SNAPSHOT"
            }
        }

    }
}