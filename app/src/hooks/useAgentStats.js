import { useState, useEffect } from 'react'
import { doc, getDoc, collection, getCountFromServer } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useAgentStats(agentId) {
  const [agent, setAgent] = useState(null)
  const [homeownerCount, setHomeownerCount] = useState(null)
  const [touchpointCount, setTouchpointCount] = useState(0)
  const [avmUsed, setAvmUsed] = useState(0)
  const [avmQuota, setAvmQuota] = useState(300)

  useEffect(() => {
    if (!agentId) {
      setAgent(null)
      setHomeownerCount(null)
      setTouchpointCount(0)
      return
    }

    let cancelled = false

    async function load() {
      try {
        const agentSnap = await getDoc(doc(db, 'agents', agentId))
        if (cancelled) return
        if (agentSnap.exists()) {
          const d = agentSnap.data()
          setAgent(d)
          setAvmUsed(d.avmUsed ?? 0)
          setAvmQuota(d.avmQuota ?? 300)
        }

        const [homeSnap, tpSnap] = await Promise.all([
          getCountFromServer(collection(db, 'agents', agentId, 'homeowners')),
          getCountFromServer(collection(db, 'agents', agentId, 'touchpoints')),
        ])
        if (!cancelled) {
          setHomeownerCount(homeSnap.data().count)
          setTouchpointCount(tpSnap.data().count)
        }
      } catch {
        if (!cancelled) setHomeownerCount(0)
      }
    }

    load()
    return () => { cancelled = true }
  }, [agentId])

  return { agent, homeownerCount, touchpointCount, avmUsed, avmQuota }
}
