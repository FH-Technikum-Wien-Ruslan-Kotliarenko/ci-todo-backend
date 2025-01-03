pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token-id')
        SONAR_HOST_URL = credentials('sonar-host-url')
        // If you push to Docker Hub, store these in Jenkins Credentials too
    }

    tools {
        nodejs 'nodejs-tool'        // Matches the name from Jenkins Global Tool Config
        dockerTool 'docker-tool'    // Matches the name from Jenkins Global Tool Config
    }

    stages {
        stage('Checkout') {
            steps {
                // This can be set differently per branch in a Multibranch Pipeline job,
                // or you can do a single pipeline with a parameter for the branch
                checkout scm
            }
        }

        // stage('Install Dependencies') {
        //     when {
        //         anyOf {
        //             branch 'main'
        //             branch 'deploy/production'
        //         }
        //     }
        //     steps {
        //         sh 'npm install'
        //     }
        // }

        // stage('Lint') {
        //     when {
        //         anyOf {
        //             branch 'main'
        //             branch 'deploy/production'
        //         }
        //     }
        //     steps {
        //         sh 'npm run lint'
        //     }
        // }

        // stage('Test') {
        //     when {
        //         anyOf {
        //             branch 'main'
        //             branch 'deploy/production'
        //         }
        //     }
        //     steps {
        //         sh 'npm run test'
        //     }
        // }

        // stage('SonarQube Analysis') {
        //     when {
        //         anyOf {
        //             branch 'main'
        //             branch 'deploy/production'
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
        //             branch 'main'
        //             branch 'deploy/production'
        //         }
        //     }
        //     steps {
        //         snykSecurity(
        //             snykInstallation: 'snyk-tool',
        //             snykTokenId: 'snyk-token-id',
        //             failOnIssues: false
        //         )
        //     }
        // }

        // stage('Build Docker Image') {
        //     when {
        //         anyOf {
        //             branch 'main'
        //             branch 'deploy/production'
        //         }
        //     }
        //     steps {
        //         sh "docker build --platform linux/amd64 -t your-dockerhub-username/ci-todo-backend:\${GIT_COMMIT} ."
        //     }
        // }

        // stage('Push Docker Image') {
        //     when {
        //         anyOf {
        //             branch 'main'
        //             branch 'deploy/production'
        //         }
        //     }
        //     steps {
        //         withDockerRegistry([credentialsId: 'dockerhub-credentials-id', url: 'https://index.docker.io/v1/']) {
        //             sh "docker push your-dockerhub-username/ci-todo-backend:\${GIT_COMMIT}"
        //         }
        //     }
        // }

        // stage('Deploy to AWS') {
        //     when {
        //         branch 'deploy/production'
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
        //                                 echo "BACKEND_TAG=\${GIT_COMMIT}" >> .env
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
                message: "Backend CI pipeline failed for commit \${env.GIT_COMMIT}"
            )
        }
    }
}
