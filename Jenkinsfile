pipeline {
    agent any

    stages {
        stage('Pre-build') {
            steps {
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
        stage('PushToMain') {
            when { allOf { branch 'dev'; triggeredBy 'UserIdCause' } }
            steps {
                withCredentials([usernamePassword(credentialsId: 'IT-Rex-Chadkins-Password',
                passwordVariable: 'GIT_PASSWORD',
                 usernameVariable: 'GIT_USERNAME')]) {
                    echo 'Pushing dev to main'
                    sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/my-org/my-repo.git dev:main')
                 }
            }
        }
    }
}

