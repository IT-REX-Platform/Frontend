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
            steps {
                echo 'Deploying....'
                sh 'sudo mv /web-build /var/lib/tomcat9/webapps/Frontend'
                sh 'sudo systemctl stop tomcat9.service'
                sh 'sudo systemctl start tomcat9.service'
            }
        }
    }
}
