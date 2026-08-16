pipeline {
    agent any

    environment {
        APP_NAME = 'demo-app'
        BUILD_VERSION = "1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout & Setup') {
            steps {
                echo "=== Step 1: Preparing build for ${env.APP_NAME} (v${env.BUILD_VERSION}) ==="
                // Prints environment details
                echo "Running on node: ${env.NODE_NAME}"
                echo "Workspace path: ${env.WORKSPACE}"
            }
        }

        stage('Build') {
            steps {
                echo "=== Step 2: Building Application ==="
                // On Windows Jenkins agents use 'bat', on Linux/macOS agents use 'sh'
                script {
                    if (isUnix()) {
                        sh 'echo "Compiling and packaging application..."'
                        sh 'mkdir -p dist && echo "Build output file content" > dist/output.txt'
                    } else {
                        bat 'echo Compiling and packaging application...'
                        bat 'if not exist dist mkdir dist'
                        bat 'echo Build output file content > dist\\output.txt'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo "=== Step 3: Running Unit and Integration Tests ==="
                script {
                    if (isUnix()) {
                        sh 'echo "Test suite passed: 100% test coverage."'
                    } else {
                        bat 'echo Test suite passed: 100% test coverage.'
                    }
                }
            }
        }

        stage('Deploy / Archive') {
            steps {
                echo "=== Step 4: Archiving build artifacts ==="
                // Archive created files so they are downloadable from Jenkins UI
                archiveArtifacts artifacts: 'dist/**', fingerprint: true, allowEmptyArchive: true
                echo "Deployment complete for v${env.BUILD_VERSION}!"
            }
        }
    }

    post {
        always {
            echo "Pipeline run completed."
        }
        success {
            echo "SUCCESS: Pipeline executed successfully!"
        }
        failure {
            echo "FAILURE: The build or test stage failed."
        }
    }
}
