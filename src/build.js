const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

const buildInfo = {
    appName: "jenkins-demo-app",
    buildTime: new Date().toISOString(),
    nodeVersion: process.version,
    status: "Production Ready"
};

const outputFilePath = path.join(distDir, 'build-summary.json');
fs.writeFileSync(outputFilePath, JSON.stringify(buildInfo, null, 2), 'utf-8');

console.log(`[BUILD] Build succeeded! Artifact generated at: ${outputFilePath}`);
