pipeline {
     agent any
     environment { 
        CI = 'true'
    }
     stages {
        stage("Build") {
            steps {
                sh "npm install --force"
                sh "npm run build"
            }
        }
        stage("Deploy") {
            steps {
                 echo "Dep"
                //sh "sudo cp -r ${WORKSPACE}/build/ /var/www/jenkins-react-app-school/"
            }
        }
    }
}
