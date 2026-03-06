import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Trim only; log a warning if key looks wrong but never overwrite (so we don't break a working setup)
const rawKey = import.meta.env.VITE_FIREBASE_API_KEY
const apiKey = typeof rawKey === 'string' ? rawKey.trim() : ''
if (!apiKey || !apiKey.startsWith('AIza') || /your|\.\.\.|example/i.test(apiKey)) {
  console.warn(
    '[Firebase] API key missing or looks invalid. If sign-in fails, set VITE_FIREBASE_API_KEY in .env (and Vercel) to ONLY the key from Firebase Console.'
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
