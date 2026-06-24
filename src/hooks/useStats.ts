import { useState, useEffect, useMemo } from 'react'
import type { TestStats, TestMode } from '../types'
import { calculateStats, getPersonalRecords } from '../services/statsService'

export const useStats = (
  typedText: string,
  targetText: string,
  timeElapsed: number,
  mode: TestMode,
  isRunning: boolean
) => {
  const [liveStats, setLiveStats] = useState<TestStats | null>(null)
  const [peakWpm, setPeakWpm] = useState<number>(0)
  const [wpmHistory, setWpmHistory] = useState<Array<{ time: number; wpm: number }>>([])

  useEffect(() => {
    if (!isRunning || typedText.length === 0) {
      // Don't reset history when idle, keep it for display
      setLiveStats(null)
      return
    }

    // Calculate current stats
    const elapsedMinutes = Math.max(timeElapsed / 60, 0.001)
    const stats = calculateStats(typedText, targetText, elapsedMinutes, mode)
    setLiveStats(stats)

    // Update peak WPM
    if (stats.wpm > peakWpm) {
      setPeakWpm(stats.wpm)
    }

    // Update WPM history - only add new points when WPM changes
    setWpmHistory(prev => {
      const newWpm = stats.wpm
      const lastEntry = prev[prev.length - 1]
      
      // Only add new entry if WPM changed or it's the first entry
      if (!lastEntry || Math.abs(lastEntry.wpm - newWpm) > 0.5) {
        const newHistory = [...prev, { 
          time: Date.now(), 
          wpm: newWpm 
        }]
        // Keep last 150 data points for performance
        return newHistory.slice(-150)
      }
      return prev
    })
  }, [typedText, targetText, timeElapsed, mode, isRunning])

  const personalRecords = useMemo(() => getPersonalRecords(), [])

  return {
    liveStats,
    peakWpm,
    wpmHistory,
    personalRecords
  }
}