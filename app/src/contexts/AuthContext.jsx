import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [agentId, setAgentId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (!firebaseUser) {
        setAgentId(null)
        setLoading(false)
        return
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const resolvedAgentId = userDoc.exists() && userDoc.data().agentId
          ? userDoc.data().agentId
          : firebaseUser.uid
        setAgentId(resolvedAgentId)
      } catch {
        setAgentId(firebaseUser.uid)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const value = { user, agentId, loading }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
