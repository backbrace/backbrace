const child_process = require('child_process')

function npm_install(where) {
    child_process.execSync('npm install', { cwd: where, env: process.env, stdio: 'inherit' })
}

npm_install('./packages/backbrace-packages');
npm_install('./packages/backbrace-sample-app');
npm_install('./packages/backbrace-docs');