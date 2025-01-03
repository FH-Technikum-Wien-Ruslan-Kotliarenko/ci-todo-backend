pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token-id')
        SONAR_HOST_URL = credentials('sonar-host-url')
    }

    tools {
        nodejs 'nodejs-tool'
        dockerTool 'docker-tool'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: env.BRANCH_NAME,
                    url: 'https://github.com/FH-Technikum-Wien-Ruslan-Kotliarenko/ci-todo-backend'
            }
        }

        // stage('Install Dependencies') {
        //     when {
        //         expression { env.BRANCH_NAME == 'main' }
        //     }
        //     steps {
        //         sh 'npm install'
        //     }
        // }

        // stage('Lint') {
        //     when {
        //         expression { env.BRANCH_NAME == 'main' }
        //     }
        //     steps {
        //         sh 'npm run lint'
        //     }
        // }

        // stage('Test') {
        //     when {
        //         expression { env.BRANCH_NAME == 'main' }
        //     }
        //     steps {
        //         sh 'npm run test'
        //     }
        // }

        // stage('Build Docker Image') {
        //     steps {
        //         sh "docker build --platform linux/amd64 -t ruslankotliar/ci-todo-backend:${GIT_COMMIT} ."
        //     }
        // }

        // stage('Push Docker Image') {
        //     steps {
        //         withDockerRegistry([credentialsId: 'dockerhub-credentials-id', url: 'https://index.docker.io/v1/']) {
        //             sh "docker push ruslankotliar/ci-todo-backend:${GIT_COMMIT}"
        //         }
        //     }
        // }

        // stage('Deploy to AWS') {
        //     when {
        //         expression { env.BRANCH_NAME == 'deploy/production' }
        //     }
        //     steps {
        //         sshPublisher(
        //             publishers: [
        //                 sshPublisherDesc(
        //                     configName: 'ec2-todo-app-ssh-server',
        //                     transfers: [
        //                         sshTransfer(
        //                             execCommand: """
        //                                 cd app
        //                                 sed -i '/^BACKEND_TAG=/d' .env
        //                                 echo "BACKEND_TAG=${GIT_COMMIT}" >> .env
        //                                 docker compose pull backend
        //                                 docker compose up -d backend
        //                             """
        //                         )
        //                     ],
        //                     usePromotionTimestamp: false,
        //                     verbose: true
        //                 )
        //             ]
        //         )
        //     }
        // }

        // Uncomment the following stage to test the failure notification
        // stage('Test Failure') {
        //     steps {
        //         sh 'exit 1' // Any non-zero exit code will fail the pipeline
        //     }
        // }
    }

    post {
        failure {
            slackSend (
                channel: '#backend',
                color: 'danger',
                message: "🚨 Jenkins: Backend CI/CD pipeline failed for branch ${env.BRANCH_NAME}."
            )
        }
    }
}
