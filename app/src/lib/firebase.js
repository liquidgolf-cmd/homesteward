import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Trim and validate: API key must be exactly from Firebase Console (starts with AIza, no placeholder text)
const rawKey = import.meta.env.VITE_FIREBASE_API_KEY
const apiKey = typeof rawKey === 'string' ? rawKey.trim() : ''
if (!apiKey || !apiKey.startsWith('AIza') || apiKey.length < 35 || /your|\.\.\.|example/i.test(apiKey)) {
  console.error(
    'Firebase API key invalid. In .env set VITE_FIREBASE_API_KEY to ONLY the key from Firebase Console → Project settings → Your apps → Web app (e.g. AIzaSy...). No quotes, no "your-key" or other text.'
  )
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
