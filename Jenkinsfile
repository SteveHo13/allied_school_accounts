pipeline {
     agent any
     environment { 
        CI = 'true'
    }
     stages {
        stage("Build") {
            steps {
                sh "npm install"
                sh "npm run build"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo cp -r ${WORKSPACE}/build/ /var/www/jenkins-react-app-school/"
            }
        }
    }
}
