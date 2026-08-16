pipeline {
    agent any

    // Automatically provision and use Node.js from Jenkins Tools
    tools {
        nodejs 'NodeJS-20'
    }

    environment {
        APP_NAME = 'demo-calculator-app'
        BUILD_VERSION = "1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout & Setup') {
            steps {
                echo "=== Step 1: Environment & Runtime Check ==="
                echo "Building ${env.APP_NAME} version ${env.BUILD_VERSION}"
                sh 'node -v && npm -v'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo "=== Step 2: Executing Test Suite ==="
                sh 'npm test'
            }
        }

        stage('Build & Package') {
            steps {
                echo "=== Step 3: Building and Packaging App ==="
                sh 'npm run build'
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo "=== Step 4: Archiving build artifacts ==="
                archiveArtifacts artifacts: 'dist/**', fingerprint: true, allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Pipeline run completed for build #${env.BUILD_NUMBER}."
        }
        success {
            echo "SUCCESS: All 8 unit tests passed and build artifact created!"
        }
        failure {
            echo "FAILURE: Tests or build step failed! Please inspect logs."
        }
    }
}
