import { useState, useEffect } from 'react'
import { doc, getDoc, collection, getCountFromServer, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { is5To7YearsAgo } from '@/lib/suggestedTouchpoints'

export function useAgentStats(agentId) {
  const [agent, setAgent] = useState(null)
  const [homeownerCount, setHomeownerCount] = useState(null)
  const [touchpointCount, setTouchpointCount] = useState(0)
  const [avmUsed, setAvmUsed] = useState(0)
  const [avmQuota, setAvmQuota] = useState(300)
  const [entering5to7Count, setEntering5to7Count] = useState(0)
  const [priorityTriggerCount, setPriorityTriggerCount] = useState(0)

  useEffect(() => {
    if (!agentId) {
      setAgent(null)
      setHomeownerCount(null)
      setTouchpointCount(0)
      setEntering5to7Count(0)
      setPriorityTriggerCount(0)
      return
    }

    let cancelled = false

    async function load() {
      try {
        const [agentSnap, homeSnap, tpSnap, txSnap, tpDocsSnap] = await Promise.all([
          getDoc(doc(db, 'agents', agentId)),
          getCountFromServer(collection(db, 'agents', agentId, 'homeowners')),
          getCountFromServer(collection(db, 'agents', agentId, 'touchpoints')),
          getDocs(collection(db, 'agents', agentId, 'transactions')),
          getDocs(collection(db, 'agents', agentId, 'touchpoints')),
        ])
        if (cancelled) return

        if (agentSnap.exists()) {
          const d = agentSnap.data()
          setAgent(d)
          setAvmUsed(d.avmUsed ?? 0)
          setAvmQuota(d.avmQuota ?? 300)
        }
        setHomeownerCount(homeSnap.data().count)
        setTouchpointCount(tpSnap.data().count)

        const fiveTo7 = new Set()
        txSnap.docs.forEach((doc) => {
          const data = doc.data()
          if (data.homeownerId && is5To7YearsAgo(data.closingDate)) {
            fiveTo7.add(data.homeownerId)
          }
        })
        setEntering5to7Count(fiveTo7.size)

        const highPriority = tpDocsSnap.docs.filter((d) => d.data().priority === 'high').length
        setPriorityTriggerCount(highPriority > 0 ? highPriority : fiveTo7.size)
      } catch {
        if (!cancelled) setHomeownerCount(0)
      }
    }

    load()
    return () => { cancelled = true }
  }, [agentId])

  return { agent, homeownerCount, touchpointCount, avmUsed, avmQuota, entering5to7Count, priorityTriggerCount }
}
