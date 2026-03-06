import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Use API key as-is; if env has extra text (e.g. "your-k" or pasted twice), extract the real key
const rawKey = import.meta.env.VITE_FIREBASE_API_KEY
let apiKey = typeof rawKey === 'string' ? rawKey.trim() : ''
// Firebase web keys are AIzaSy + 33 chars; extract if buried in placeholder text
const keyMatch = apiKey.match(/AIzaSy[A-Za-z0-9_-]{33}/)
if (keyMatch) {
  apiKey = keyMatch[0]
}
if (!apiKey) {
  console.warn('[Firebase] No valid API key found. Set VITE_FIREBASE_API_KEY in .env and Vercel to the key from Firebase Console.')
}

const authDomain = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim()
const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim()
const storageBucket = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').trim()
const messagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '').toString().trim()
const appId = (import.meta.env.VITE_FIREBASE_APP_ID || '').trim()

const firebaseConfig = {
  apiKey,
  authDomain: authDomain || undefined,
  projectId: projectId || undefined,
  storageBucket: storageBucket || undefined,
  messagingSenderId: messagingSenderId || undefined,
  appId: appId || undefined,
}

// Debug: confirm which project is loaded (check browser console)
if (typeof window !== 'undefined') {
  console.log('[Firebase] Config loaded:', { projectId, authDomain, appId: appId ? `${appId.slice(0, 20)}...` : '(missing)' })
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
