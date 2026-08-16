pipeline {
    // 1. Tell Jenkins to run this on any available executor/computer
    agent any

    // 2. Define global variables for your builds
    environment {
        APP_NAME = 'demo-app'
        BUILD_VERSION = "1.0.${BUILD_NUMBER}"
    }

    // 3. Define the pipeline steps in order
    stages {

        stage('Checkout & Setup') {
            steps {
                echo "Starting build for ${env.APP_NAME} version ${env.BUILD_VERSION}"
            }
        }

        stage('Build') {
            steps {
                echo "Compiling and packaging application..."
                // Here you would put your real build command:
                // e.g. sh 'npm run build' or bat 'mvn clean package'
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running unit tests..."
                // e.g. sh 'npm test' or bat 'pytest'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying application to server..."
            }
        }
    }

    // 4. What to do after everything finishes
    post {
        success {
            echo "Build passed successfully!"
        }
        failure {
            echo "Something failed! Send alert."
        }
    }
}
