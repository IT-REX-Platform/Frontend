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
                sh 'ITREX_CHANNEL=staging bash -c "expo build:web"'
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
            when {
                branch 'dev'
            }
            environment {
                scannerHome = tool 'SonarQubeScanner'
            }
            steps {
                sh "npm run lint || true"
                withSonarQubeEnv('sonarqube') {
                    sh "sonar-scanner"
                }
                timeout(time: 10, unit: 'MINUTES') {
                    // Needs to be changed to true in the real project.
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Deploy') {
            when {
                branch 'dev'
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
