// frontend/src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier } from 'firebase/auth'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Initialize reCAPTCHA verifier
export const setupRecaptcha = (containerId: string) => {
    window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
        size: 'invisible',
        callback: (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
    }, auth)
}

export { auth }
