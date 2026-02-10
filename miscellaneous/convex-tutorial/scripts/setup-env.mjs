#!/usr/bin/env node
import { execSync } from 'child_process';
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const REQUIRED_VARS = ['JWT_PRIVATE_KEY', 'JWKS', 'SITE_URL'];

console.log('🔍 Checking Convex environment variables...\n');

// Get current environment variables
let currentEnv = {};
try {
  const output = execSync('npx convex env list', { encoding: 'utf-8' });
  if (output.includes('No environment variables set.')) {
    console.log('⚠️  No environment variables found.');
  } else {
    // Parse the output
    output.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=/);
      if (match) {
        currentEnv[match[1]] = true;
      }
    });
  }
} catch (error) {
  console.error('❌ Failed to check environment variables:', error.message);
  process.exit(1);
}

// Check which variables are missing
const missingVars = REQUIRED_VARS.filter(v => !currentEnv[v]);

if (missingVars.length === 0) {
  console.log('✅ All required environment variables are set!\n');
  process.exit(0);
}

console.log(`⚠️  Missing environment variables: ${missingVars.join(', ')}\n`);
console.log('🔧 Setting up missing environment variables...\n');

// Generate keys if needed
if (missingVars.includes('JWT_PRIVATE_KEY') || missingVars.includes('JWKS')) {
  console.log('🔑 Generating JWT keys...');
  
  const keys = await generateKeyPair("RS256", { extractable: true });
  const privateKey = await exportPKCS8(keys.privateKey);
  const publicKey = await exportJWK(keys.publicKey);
  const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

  if (missingVars.includes('JWT_PRIVATE_KEY')) {
    const jwtKey = privateKey.trimEnd().replace(/\n/g, " ");
    try {
      execSync(`npx convex env set -- JWT_PRIVATE_KEY "${jwtKey}"`, { stdio: 'inherit' });
      console.log('✅ Set JWT_PRIVATE_KEY');
    } catch (error) {
      console.error('❌ Failed to set JWT_PRIVATE_KEY');
      process.exit(1);
    }
  }

  if (missingVars.includes('JWKS')) {
    try {
      execSync(`npx convex env set -- JWKS '${jwks}'`, { stdio: 'inherit' });
      console.log('✅ Set JWKS');
    } catch (error) {
      console.error('❌ Failed to set JWKS');
      process.exit(1);
    }
  }
}

// Set SITE_URL if missing
if (missingVars.includes('SITE_URL')) {
  const siteUrl = process.env.SITE_URL || 'http://localhost:5173';
  try {
    execSync(`npx convex env set SITE_URL "${siteUrl}"`, { stdio: 'inherit' });
    console.log(`✅ Set SITE_URL to ${siteUrl}`);
  } catch (error) {
    console.error('❌ Failed to set SITE_URL');
    process.exit(1);
  }
}

console.log('\n✨ Environment setup complete!\n');
