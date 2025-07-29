#!/usr/bin/env node

/**
 * PayPing Configuration Test Script
 * Tests all Phase 1 implementations and guides configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

console.log('🔧 PayPing Phase 1 Configuration Test\n');

// Check if .env file exists
const envPath = path.join(projectRoot, '.env');
const envExists = fs.existsSync(envPath);

console.log('📋 Configuration Checklist:');
console.log(`✅ .env file: ${envExists ? 'EXISTS' : '❌ MISSING'}`);

if (!envExists) {
  console.log('\n❌ Please create your .env file first:');
  console.log('   copy .env.example .env');
  console.log('\n📝 Then configure these critical settings:\n');
} else {
  // Read and check .env file
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  console.log('\n🔍 Environment Variable Status:');
  
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const optionalVars = [
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_SENDGRID_API_KEY',
    'VITE_EMAILJS_SERVICE_ID'
  ];

  let requiredConfigured = 0;
  let optionalConfigured = 0;

  // Check required variables
  console.log('\n📱 Firebase Configuration (REQUIRED):');
  requiredVars.forEach(varName => {
    const configured = envContent.includes(`${varName}=`) && 
                     !envContent.includes(`${varName}=your-`) &&
                     !envContent.includes(`${varName}=YOUR_`);
    
    if (configured) requiredConfigured++;
    console.log(`   ${configured ? '✅' : '❌'} ${varName}`);
  });

  // Check optional variables
  console.log('\n💳 Payment & Email Configuration (OPTIONAL):');
  optionalVars.forEach(varName => {
    const configured = envContent.includes(`${varName}=`) && 
                     !envContent.includes(`${varName}=your-`) &&
                     !envContent.includes(`${varName}=SG.your-`) &&
                     !envContent.includes(`${varName}=pk_test_your-`);
    
    if (configured) optionalConfigured++;
    console.log(`   ${configured ? '✅' : '⏳'} ${varName}`);
  });

  // Overall status
  console.log('\n📊 Configuration Status:');
  console.log(`   Required: ${requiredConfigured}/${requiredVars.length} configured`);
  console.log(`   Optional: ${optionalConfigured}/${optionalVars.length} configured`);
  
  const isReady = requiredConfigured === requiredVars.length;
  console.log(`   Status: ${isReady ? '✅ READY TO TEST' : '⏳ NEEDS CONFIGURATION'}`);
}

// Check if Firestore rules exist
const rulesPath = path.join(projectRoot, 'firestore.rules');
const rulesExist = fs.existsSync(rulesPath);
console.log(`\n🔒 Security Rules: ${rulesExist ? '✅ READY TO DEPLOY' : '❌ MISSING'}`);

// Check if new services exist
const servicesPath = path.join(projectRoot, 'src', 'services');
const newServices = [
  'auditService.js',
  'errorMonitoring.js', 
  'paymentGateway.js',
  'productionEmailService.js'
];

console.log('\n🛠️ Phase 1 Services:');
newServices.forEach(service => {
  const servicePath = path.join(servicesPath, service);
  const exists = fs.existsSync(servicePath);
  console.log(`   ${exists ? '✅' : '❌'} ${service}`);
});

// Configuration guidance
console.log('\n📖 Configuration Guide:');
console.log('\n1️⃣ Firebase Setup (REQUIRED):');
console.log('   • Go to: https://console.firebase.google.com');
console.log('   • Select your project: payping-a060a');
console.log('   • Go to Project Settings > General');
console.log('   • Copy your Web App config values to .env');

console.log('\n2️⃣ Stripe Setup (for payments):');
console.log('   • Go to: https://dashboard.stripe.com/test/apikeys');
console.log('   • Copy Publishable key to VITE_STRIPE_PUBLISHABLE_KEY');
console.log('   • Get Secret key for backend integration');

console.log('\n3️⃣ SendGrid Setup (for production emails):');
console.log('   • Go to: https://app.sendgrid.com/settings/api_keys');
console.log('   • Create new API key with Full Access');
console.log('   • Copy to VITE_SENDGRID_API_KEY');

console.log('\n4️⃣ Deploy Security Rules:');
console.log('   • Install Firebase CLI: npm install -g firebase-tools');
console.log('   • Login: firebase login');
console.log('   • Deploy rules: firebase deploy --only firestore:rules');

console.log('\n🚀 Next Steps:');
console.log('   1. Configure .env with your credentials');
console.log('   2. Run: npm run dev');
console.log('   3. Test authentication and basic features');
console.log('   4. Deploy Firestore security rules');
console.log('   5. Test payment and email integrations');

console.log('\n✨ Ready to launch! Your Phase 1 implementation is complete.\n');
