const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 TaskLit Setup Script');
console.log('=======================\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm version: ${npmVersion.trim()}`);
} catch (error) {
  console.error('❌ npm is not installed. Please install npm first.');
  process.exit(1);
}

// Install server dependencies
console.log('\n📦 Installing server dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Server dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install server dependencies');
  process.exit(1);
}

// Check if client directory exists
if (!fs.existsSync(path.join(__dirname, 'client'))) {
  console.error('❌ Client directory not found. Please ensure the project structure is correct.');
  process.exit(1);
}

// Install client dependencies
console.log('\n📦 Installing client dependencies...');
try {
  execSync('npm install', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, 'client')
  });
  console.log('✅ Client dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install client dependencies');
  process.exit(1);
}

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('✅ Created data directory');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the backend server: npm run dev');
console.log('2. In another terminal, start the frontend: npm run client');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\n📚 Happy coding with TaskLit! 📚'); 