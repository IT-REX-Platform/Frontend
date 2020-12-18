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
        if (env.BRANCH_NAME == 'main') {
            stage('Deploy') {
                steps {
                    echo 'Deploying....'
                    sh 'rm -r /srv/*'
                    sh 'mv ./web-build/* /srv'
                }
            }
        }
    }
}
