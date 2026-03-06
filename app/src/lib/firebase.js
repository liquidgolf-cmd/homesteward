import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Trim and validate: API key must be ONLY the key from Firebase (starts with AIzaSy, ~39 chars, no placeholder text)
const rawKey = import.meta.env.VITE_FIREBASE_API_KEY
let apiKey = typeof rawKey === 'string' ? rawKey.trim() : ''
const hasPlaceholder = /your|\.\.\.|example|your-key/i.test(apiKey)
const hasDuplicateKey = (apiKey.match(/AIza/g) || []).length > 1
const wrongLength = apiKey.length < 35 || apiKey.length > 45
if (!apiKey || !apiKey.startsWith('AIzaSy') || wrongLength || hasPlaceholder || hasDuplicateKey) {
  if (apiKey && (hasPlaceholder || hasDuplicateKey)) {
    console.error(
      '[Firebase] Your VITE_FIREBASE_API_KEY looks like it has extra text (e.g. "your-key" or the key pasted twice). ' +
      'It must be ONLY the key: open Firebase Console → Project settings → Your apps → Web app → copy "API key". ' +
      'Paste nothing else — no quotes, no "key=", no other words. The key is about 39 characters and starts with AIzaSy.'
    )
    apiKey = '' // Don't send malformed key to Firebase
  } else if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    console.error(
      '[Firebase] Missing or invalid API key. In .env set VITE_FIREBASE_API_KEY to ONLY the key from Firebase Console (starts with AIzaSy, ~39 chars). No quotes, no extra text.'
    )
    apiKey = ''
  }
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
