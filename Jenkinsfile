def agentLabel
if (BRANCH_NAME == 'main') {
    agentLabel = 'master'
} else {
    agentLabel = ''
}

pipeline {
    agent { label agentLabel }

    stages {
        stage('Pre-build') {
            steps {
                echo "NODE_NAME = ${env.NODE_NAME}"
                echo 'Pre-build..'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'expo build:web'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                echo 'Run jest..'
                sh 'npm run test'
            }
        }
        stage('quality analysis'){
            environment {
                scannerHome = tool 'SonarQubeScanner'
            }
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh "node analyze.js"
                }
                timeout(time: 10, unit: 'MINUTES') {
                    // Needs to be changed to true in the real project.
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying....'
                sh 'rm -r /srv/Frontend/*'
                sh 'mv ./web-build/* /srv/Frontend/'
            }
        }
        stage('Release') {
            when { allOf { branch 'dev'; triggeredBy 'UserIdCause' } }
            steps {
                sshagent (credentials: ['jenkins']) {
                    echo 'Pushing dev to main'
                    sh 'git push git@github.com:IT-REX-Platform/Frontend.git dev:main'
                }
            }
        }
    }
}
