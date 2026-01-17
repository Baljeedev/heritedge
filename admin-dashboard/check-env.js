// Quick script to check if environment variables are set
// Run with: node check-env.js

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

console.log('🔍 Checking environment variables...\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Create it in the admin-dashboard directory with:');
  console.log('');
  console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...');
  console.log('CLERK_SECRET_KEY=sk_test_...');
  process.exit(1);
}

// Read .env.local file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('📋 Found environment variables:\n');

const required = {
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': 'Publishable Key (starts with pk_)',
  'CLERK_SECRET_KEY': 'Secret Key (starts with sk_)',
};

let allPresent = true;

Object.entries(required).forEach(([key, description]) => {
  const value = envVars[key];
  if (value) {
    // Check if it looks like a valid key
    if (key === 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY' && !value.startsWith('pk_')) {
      console.log(`⚠️  ${key}: Found but doesn't start with 'pk_'`);
      allPresent = false;
    } else if (key === 'CLERK_SECRET_KEY' && !value.startsWith('sk_')) {
      console.log(`⚠️  ${key}: Found but doesn't start with 'sk_'`);
      allPresent = false;
    } else {
      // Show first and last 4 chars for security
      const masked = value.length > 8 
        ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
        : '***';
      console.log(`✅ ${key}: ${masked}`);
    }
  } else {
    console.log(`❌ ${key}: MISSING`);
    console.log(`   ${description}`);
    allPresent = false;
  }
});

console.log('');

if (allPresent) {
  console.log('✅ All required environment variables are set!');
  console.log('💡 Make sure to restart your dev server after adding/updating .env.local');
} else {
  console.log('❌ Some environment variables are missing or invalid.');
  console.log('📖 See QUICK_START.md for instructions on how to get your Clerk keys.');
  process.exit(1);
}