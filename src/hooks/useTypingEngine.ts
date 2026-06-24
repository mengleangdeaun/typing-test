import { useState, useEffect, useMemo, useCallback } from 'react'
import type { TestStatus, TestMode, Difficulty, TimerDuration } from '../types'
import { calculateStats, saveSession } from '../services/statsService'
import { getRandomText, generateZenText, getQuoteText } from '../services/textService'

interface UseTypingEngineProps {
  mode: TestMode
  language: 'english' | 'khmer'
  difficulty: Difficulty
  timerDuration: TimerDuration
  wordCount?: 10 | 25 | 50 | 100
  customText?: string
}

export const useTypingEngine = ({
  mode,
  language,
  difficulty,
  timerDuration,
  wordCount = 25,
  customText = ''
}: UseTypingEngineProps) => {
  const [status, setStatus] = useState<TestStatus>('idle')
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration)
  const [typedText, setTypedText] = useState<string>('')
  const [targetText, setTargetText] = useState<string>('')
  const [startTime, setStartTime] = useState<number>(0)
  const [wpmHistory, setWpmHistory] = useState<Array<{ time: number; wpm: number }>>([])
  const [wordIndex, setWordIndex] = useState<number>(0)
  const [wordHistory, setWordHistory] = useState<Array<{ word: string; typed: string; correct: boolean; time: number }>>([])

  // Initialize text based on mode
  const initText = useCallback(() => {
    let text = ''
    switch (mode) {
      case 'time':
        text = getRandomText(language)
        break
      case 'words':
        const words = generateZenText(difficulty).split(' ').slice(0, wordCount)
        text = words.join(' ')
        break
      case 'quote':
        const quote = getQuoteText()
        text = quote.text
        break
      case 'zen':
        text = generateZenText(difficulty)
        break
      case 'custom':
        text = customText.trim() || 'Please enter custom text to begin'
        break
      default:
        text = getRandomText(language)
    }
    setTargetText(text)
    return text
  }, [mode, language, difficulty, wordCount, customText])

  // Reset test
  const resetTest = useCallback(() => {
    setStatus('idle')
    setTimeLeft(mode === 'zen' ? Infinity : timerDuration)
    setTypedText('')
    setWpmHistory([])
    setWordIndex(0)
    setWordHistory([])
    setStartTime(0)
    initText()
  }, [mode, timerDuration, initText])

  // Initialize on mode/language change
  useEffect(() => {
    resetTest()
  }, [mode, language, difficulty, timerDuration, wordCount, customText, resetTest])

  // Timer logic
  useEffect(() => {
    let interval: any = null
    
    if (status === 'running' && timeLeft > 0 && mode !== 'zen') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus('finished')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [status, timeLeft, mode])

  // Handle typing
  const handleTyping = useCallback((value: string) => {
    if (status === 'finished') return

    let currentStartTime = startTime
    let currentStatus = status

    // Start the test on first character
    if (status === 'idle' && value.length > 0) {
      const now = Date.now()
      currentStatus = 'running'
      currentStartTime = now
      setStatus('running')
      setStartTime(now)
    }

    // Update typed text
    setTypedText(value)

    // Update word index for words mode
    if (mode === 'words') {
      const words = value.split(' ')
      setWordIndex(words.length - 1)
    }

    // Calculate WPM for history - collect at regular intervals
    if (value.length > 0 && currentStatus === 'running') {
      const elapsedMinutes = (Date.now() - currentStartTime) / 60000
      const currentWpm = Math.round((value.length / 5) / Math.max(elapsedMinutes, 0.01))
      
      // Add to history every 5 characters or when WPM changes significantly
      setWpmHistory(prev => {
        const lastEntry = prev[prev.length - 1]
        if (!lastEntry || 
            value.length % 5 === 0 || 
            Math.abs(lastEntry.wpm - currentWpm) > 2) {
          return [...prev, { time: Date.now(), wpm: currentWpm }]
        }
        return prev
      })
    }

    // Check completion conditions
    if (mode === 'words') {
      const words = value.trim().split(' ')
      if (words.length >= wordCount) {
        setStatus('finished')
      }
    } else if (mode === 'quote' || mode === 'time' || mode === 'custom') {
      if (value.length >= targetText.length) {
        setStatus('finished')
      }
    }
  }, [status, startTime, mode, wordCount, targetText])

  // Calculate live stats dynamically on every keystroke
  const stats = useMemo(() => {
    if (typedText.length === 0) return null

    const elapsedMinutes = status === 'finished'
      ? (mode === 'zen' ? (Date.now() - startTime) / 60000 : (timerDuration - timeLeft) / 60)
      : (Date.now() - startTime) / 60000

    return calculateStats(typedText, targetText, Math.max(elapsedMinutes, 0.001), mode)
  }, [status, typedText, targetText, mode, timerDuration, timeLeft, startTime])

  // Save session EXACTLY once when status transitions to finished
  useEffect(() => {
    if (status === 'finished' && typedText.length > 0 && stats && stats.wpm > 0) {
      const elapsedMinutes = mode === 'zen'
        ? (Date.now() - startTime) / 60000
        : (timerDuration - timeLeft) / 60

      saveSession({
        date: Date.now(),
        mode,
        duration: Math.max(elapsedMinutes * 60, 1),
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        rawWpm: stats.rawWpm,
        consistency: stats.consistency,
        difficulty,
        stats,
        textPreview: targetText.slice(0, 50) + '...'
      })
    }
  }, [status, mode, timerDuration, timeLeft, startTime, difficulty, typedText, targetText, stats])

  return {
    status,
    timeLeft,
    typedText,
    targetText,
    stats,
    wpmHistory,
    wordIndex,
    wordHistory,
    handleTyping,
    resetTest,
    setTargetText
  }
}