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

        stage('Security Scan (OWASP ZAP)') {
            steps {
                echo "=== Step 4: Running OWASP ZAP DAST Security Scan ==="
                script {
                    // Start the Node app in background and record PID
                    sh '''
                        node src/server.js > app.log 2>&1 &
                        echo $! > app.pid
                        echo "App started with PID $(cat app.pid)"
                    '''

                    // Wait for the app to be available
                    sh '''
                        echo "Waiting for app to start..."
                        for i in $(seq 1 15); do
                            if curl -s http://localhost:3000/api/health | grep -q "UP"; then
                                echo "App is healthy and responding!"
                                exit 0
                            fi
                            echo "Waiting for service (attempt $i)..."
                            sleep 1
                        done
                        echo "App failed to start in time!"
                        cat app.log
                        exit 1
                    '''

                    // Run OWASP ZAP baseline scan inside Docker container
                    // -I: Ignore warnings so pipeline generates report without failing on minor baseline findings
                    // -r: HTML report, -J: JSON report
                    sh '''
                        echo "Starting OWASP ZAP Baseline Scan..."
                        docker run --rm --network="host" \
                            -v "${WORKSPACE}:/zap/wrk/:rw" \
                            -t ghcr.io/zaproxy/zaproxy:stable \
                            zap-baseline.py -t http://localhost:3000 -r zap_report.html -J zap_report.json -I || true
                    '''
                }
            }
            post {
                always {
                    // Gracefully stop background server using PID
                    sh '''
                        if [ -f app.pid ]; then
                            PID=$(cat app.pid)
                            echo "Stopping Node.js server (PID: $PID)..."
                            kill -9 $PID 2>/dev/null || true
                            rm -f app.pid
                        fi
                    '''
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo "=== Step 5: Archiving build and security artifacts ==="
                archiveArtifacts artifacts: 'dist/**, zap_report.html, zap_report.json', fingerprint: true, allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Pipeline run completed for build #${env.BUILD_NUMBER}."
        }
        success {
            echo "SUCCESS: Tests passed, OWASP ZAP scan finished, and artifacts archived!"
        }
        failure {
            echo "FAILURE: Pipeline execution failed! Please inspect logs."
        }
    }
}
