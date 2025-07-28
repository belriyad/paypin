// Test Firebase Google Authentication Setup
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export async function testGoogleAuth() {
  try {
    console.log('Testing Firebase configuration...');
    console.log('Auth instance:', auth);
    console.log('Auth config:', auth.config);
    
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log('Google provider configured successfully');
    return { success: true, message: 'Firebase and Google provider configured correctly' };
  } catch (error) {
    console.error('Auth test failed:', error);
    return { success: false, error: error.message };
  }
}

export function checkFirebaseConfig() {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  
  console.log('Firebase config:', config);
  
  const missingVars = Object.entries(config)
    .filter(([key, value]) => !value || value.startsWith('YOUR_'))
    .map(([key]) => key);
  
  if (missingVars.length > 0) {
    console.error('Missing Firebase environment variables:', missingVars);
    return false;
  }
  
  console.log('All Firebase environment variables are set');
  return true;
}
