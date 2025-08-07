const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

console.log('Starting build process...');

try {
  // Install client dependencies
  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  // Build the React app
  console.log('Building React app...');
  execSync('cd client && npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
