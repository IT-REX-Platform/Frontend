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
    }
}
