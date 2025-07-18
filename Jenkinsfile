pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token-id')
        SONAR_HOST_URL = credentials('sonar-host-url')
        DOCKERHUB_USERNAME = credentials('dockerhub-username')
        SLACK_BACKEND_CHANNEL_ID = credentials('slack-backend-channel-id')

        // Constants
        DOCKER_PLATFORM = "linux/amd64"
        MAIN_BRANCH = 'main'
        DEPLOY_PROD_BRANCH = 'deploy/production'
    }

    tools {
        nodejs 'nodejs-tool'        // Matches the name from Jenkins Global Tool Config
        dockerTool 'docker-tool'    // Matches the name from Jenkins Global Tool Config
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // stage('Install Dependencies') {
        //     when {
        //         anyOf {
        //             branch MAIN_BRANCH
        //             branch DEPLOY_PROD_BRANCH
        //         }
        //     }
        //     steps {
        //         sh 'npm install'
        //     }
        // }

        // stage('Lint') {
        //     when {
        //         anyOf {
        //             branch MAIN_BRANCH
        //             branch DEPLOY_PROD_BRANCH
        //         }
        //     }
        //     steps {
        //         sh 'npm run lint'
        //     }
        // }

        // stage('Test') {
        //     environment {
        //         DB_DIALECT = credentials('DB_DIALECT')
        //         DB_USER = credentials('DB_USER')
        //         DB_PW = credentials('DB_PW')
        //         DB_HOST = credentials('DB_HOST')
        //         DB_NAME = credentials('DB_NAME')
        //     }
        //     when {
        //         anyOf {
        //             branch MAIN_BRANCH
        //             branch DEPLOY_PROD_BRANCH
        //         }
        //     }
        //     steps {
        //         sh 'npm run test'
        //     }
        // }

        // stage('SonarQube Analysis') {
        //     when {
        //         anyOf {
        //             branch MAIN_BRANCH
        //             branch DEPLOY_PROD_BRANCH
        //         }
        //     }
        //     steps {
        //         script {
        //             withSonarQubeEnv('sonar-scanner-installation') {
        //                 sh """
        //                     ${tool('sonar-scanner-tool')}/bin/sonar-scanner \\
        //                         -Dsonar.projectKey=ci-todo-backend \\
        //                         -Dsonar.sources=. \\
        //                         -Dsonar.host.url=${SONAR_HOST_URL} \\
        //                         -Dsonar.login=${SONAR_TOKEN}
        //                 """
        //             }
        //         }
        //     }
        // }

        // stage('Snyk Security Scan') {
        //     when {
        //         anyOf {
        //             branch MAIN_BRANCH
        //             branch DEPLOY_PROD_BRANCH
        //         }
        //     }
        //     steps {
        //         snykSecurity(
        //             snykInstallation: 'snyk-tool',
        //             snykTokenId: 'snyk-token-id',
        //             failOnIssues: false // ideally should be true, but for demo purposes we set it to false
        //         )
        //     }
        // }

        // stage('Build Docker Image') {
        //     when {
        //         anyOf {
        //             branch MAIN_BRANCH
        //             branch DEPLOY_PROD_BRANCH
        //         }
        //     }
        //     steps {
        //         sh "docker build --platform \${DOCKER_PLATFORM} -t \${DOCKERHUB_USERNAME}/ci-todo-backend:\${GIT_COMMIT} ."
        //     }
        // }

        // stage('Push Docker Image') {
        //     when {
        //         anyOf {
        //             branch MAIN_BRANCH
        //             branch DEPLOY_PROD_BRANCH
        //         }
        //     }
        //     steps {
        //         withDockerRegistry([credentialsId: 'dockerhub-credentials-id', url: 'https://index.docker.io/v1/']) {
        //             sh "docker push \${DOCKERHUB_USERNAME}/ci-todo-backend:\${GIT_COMMIT}"
        //         }
        //     }
        // }

        // stage('Deploy to AWS') {
        //     when {
        //         branch DEPLOY_PROD_BRANCH
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

        //                                 # 1. Update .env to set BACKEND_GREEN_TAG
        //                                 sed -i '/^BACKEND_GREEN_TAG=/d' .env
        //                                 echo "BACKEND_GREEN_TAG=${GIT_COMMIT}" >> .env

        //                                 # 2. Deploy 'backend_green'
        //                                 docker compose pull backend_green
        //                                 docker compose up -d backend_green

        //                                 # 3. Optional: check logs or do health check

        //                                 # 4. Flip Nginx from backend_blue to backend_green
        //                                 sed -i 's/set \$active_backend backend_blue;/set \$active_backend backend_green;/' nginx.conf

        //                                 # 5. Reload Nginx
        //                                 docker compose restart nginx
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
                channel: SLACK_BACKEND_CHANNEL_ID,
                color: 'danger',
                message: "🚨 Backend CI pipeline failed for commit \${env.GIT_COMMIT}"
            )
        }
    }
}
