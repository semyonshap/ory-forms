'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useCooldown(seconds: number = 60) {
  const [remaining, setRemaining] = useState(0)
  const deadlineRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    const deadline = deadlineRef.current
    if (!deadline) return

    const left = Math.ceil((deadline - Date.now()) / 1000)
    if (left <= 0) {
      deadlineRef.current = null
      clearTimer()
      setRemaining(0)
    } else {
      setRemaining(left)
    }
  }, [clearTimer])

  const start = useCallback(() => {
    clearTimer()
    deadlineRef.current = Date.now() + seconds * 1000
    setRemaining(seconds)
    intervalRef.current = setInterval(tick, 1000)
  }, [seconds, tick, clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    deadlineRef.current = null
    setRemaining(0)
  }, [clearTimer])

  useEffect(() => clearTimer, [clearTimer])

  return { remaining, isActive: remaining > 0, start, reset }
}
