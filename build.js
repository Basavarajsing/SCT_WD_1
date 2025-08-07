const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

console.log('🚀 Starting TaskLit build process...');

try {
  // Check if client directory exists
  const clientPath = path.join(__dirname, 'client');
  if (!fs.existsSync(clientPath)) {
    throw new Error('Client directory not found!');
  }

  // Install client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('npm install', { cwd: clientPath, stdio: 'inherit' });
  
  // Build the React app
  console.log(' Building React app...');
  execSync('npm run build', { cwd: clientPath, stdio: 'inherit' });
  
  // Verify build was created
  const buildPath = path.join(clientPath, 'build');
  if (!fs.existsSync(buildPath)) {
    throw new Error('Build directory was not created!');
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Build location:', buildPath);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
