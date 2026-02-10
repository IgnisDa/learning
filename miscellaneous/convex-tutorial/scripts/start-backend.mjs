#!/usr/bin/env node
import { spawn, execSync } from 'child_process';

console.log('🚀 Starting Convex backend...\n');

// Start Convex dev
const backend = spawn('npx', ['convex', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Wait for backend to be ready
let attempts = 0;
const maxAttempts = 30;

const checkBackend = async () => {
  while (attempts < maxAttempts) {
    try {
      execSync('curl -s http://127.0.0.1:3210/version', { 
        stdio: 'ignore', 
        timeout: 1000 
      });
      console.log('\n✅ Backend is ready! Checking environment...\n');
      
      // Run auth configuration check
      try {
        execSync('npm run configure-auth', { stdio: 'inherit' });
      } catch (error) {
        console.error('\n⚠️  Auth configuration failed, but continuing...\n');
      }
      
      return;
    } catch (e) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  console.error('\n❌ Backend failed to start\n');
  backend.kill();
  process.exit(1);
};

// Start checking after a brief delay
setTimeout(checkBackend, 2000);

// Handle cleanup
process.on('SIGINT', () => {
  backend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  backend.kill();
  process.exit(0);
});

backend.on('exit', (code) => {
  process.exit(code);
});
