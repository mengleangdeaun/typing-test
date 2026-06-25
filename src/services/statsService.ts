import type { TestStats, AdvancedStats, TestMode, Session } from '../types'
import { segmentGraphemes, normalizeText } from '../lib/utils'
import { generateId } from '../lib/utils'

export const calculateStats = (
  typed: string,
  target: string,
  timeElapsedMinutes: number,
  mode: TestMode = 'time'
): TestStats => {
  if (timeElapsedMinutes === 0 || typed.length === 0) {
    return getEmptyStats()
  }

  // Use grapheme clusters so Khmer (and other multi-codepoint scripts) are
  // counted and compared correctly.
  const typedChars = segmentGraphemes(normalizeText(typed))
  const targetChars = segmentGraphemes(normalizeText(target))
  const minLength = Math.min(typedChars.length, targetChars.length)

  // Basic calculations
  let correctChars = 0
  const errors: Record<string, number> = {}
  const wpmHistory: Array<{ time: number; wpm: number }> = []
  
  for (let i = 0; i < minLength; i++) {
    const typedGlyph = typedChars[i]
    const targetGlyph = targetChars[i]
    const isLastTyped = i === typedChars.length - 1

    if (typedGlyph === targetGlyph) {
      correctChars++
    } else if (isLastTyped && targetGlyph.startsWith(typedGlyph)) {
      // Last grapheme is a valid prefix of the target (Khmer syllable still composing).
      // Don't count it as correct yet, but don't count it as an error either.
    } else {
      const char = targetGlyph || 'unknown'
      errors[char] = (errors[char] || 0) + 1
    }
  }

  // Word calculations
  const targetWords = target.split(' ')
  const typedWords = typed.split(' ')
  let correctWords = 0
  let incorrectWords = 0

  for (let i = 0; i < Math.min(targetWords.length, typedWords.length); i++) {
    if (typedWords[i] === targetWords[i]) {
      correctWords++
    } else {
      incorrectWords++
    }
  }

  // Calculate WPM metrics — use grapheme count (not code-unit length) so that
  // Khmer characters are not counted multiple times due to their multi-codepoint nature.
  const typedGraphemeCount = typedChars.length
  const rawWpm = Math.round((typedGraphemeCount / 5) / timeElapsedMinutes)
  const netWpm = Math.round((correctChars / 5) / timeElapsedMinutes)
  const wpm = mode === 'zen' ? Math.round((typedGraphemeCount / 5) / Math.max(timeElapsedMinutes, 0.1)) : netWpm

  // Accuracy metrics — use grapheme counts, not code-unit lengths
  const accuracy = typedGraphemeCount > 0 ? Math.round((correctChars / typedGraphemeCount) * 100) : 0
  const adjustedAccuracy = minLength > 0 ? Math.round((correctChars / minLength) * 100) : 0

  // Consistency (simplified)
  const consistency = accuracy > 0 ? Math.min(100, Math.round(accuracy * 0.9 + 10)) : 0

  // Sort errors
  const sortedErrors = Object.entries(errors)
    .sort((a, b) => b[1] - a[1])
    .map(([char, count]) => ({ char, count }))

  return {
    wpm,
    accuracy,
    rawWpm,
    netWpm,
    adjustedAccuracy,
    charactersTyped: typedGraphemeCount,
    correctChars,
    incorrectChars: typedGraphemeCount - correctChars,
    totalTime: timeElapsedMinutes * 60,
    typingTime: timeElapsedMinutes * 60,
    idleTime: 0,
    consistency,
    correctWords,
    incorrectWords,
    peakWpm: wpm,
    wpmHistory,
    errorHeatmap: errors,
    mostCommonErrors: sortedErrors.slice(0, 5)
  }
}

export const getEmptyStats = (): TestStats => ({
  wpm: 0,
  accuracy: 0,
  rawWpm: 0,
  netWpm: 0,
  adjustedAccuracy: 0,
  charactersTyped: 0,
  correctChars: 0,
  incorrectChars: 0,
  totalTime: 0,
  typingTime: 0,
  idleTime: 0,
  consistency: 0,
  correctWords: 0,
  incorrectWords: 0,
  peakWpm: 0,
  wpmHistory: [],
  errorHeatmap: {},
  mostCommonErrors: []
})

export const calculateAdvancedStats = (stats: TestStats): AdvancedStats => {
  const grossWpm = stats.rawWpm
  const charAccuracy = stats.charactersTyped > 0 
    ? Math.round((stats.correctChars / stats.charactersTyped) * 100) 
    : 0
  const wordAccuracy = (stats.correctWords + stats.incorrectWords) > 0
    ? Math.round((stats.correctWords / (stats.correctWords + stats.incorrectWords)) * 100)
    : 0

  return {
    ...stats,
    grossWpm,
    charAccuracy,
    wordAccuracy,
    timePerWord: [],
    errorsByPosition: []
  }
}

export const saveSession = (session: Omit<Session, 'id'>): void => {
  const sessions = getSessions()
  const newSession: Session = {
    ...session,
    id: generateId()
  }
  sessions.push(newSession)
  localStorage.setItem('typing_sessions', JSON.stringify(sessions))
}

export const getSessions = (): Session[] => {
  try {
    const data = localStorage.getItem('typing_sessions')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const clearSessions = (): void => {
  localStorage.removeItem('typing_sessions')
}

export const getPersonalRecords = (): Record<string, any> => {
  const sessions = getSessions()
  if (sessions.length === 0) return {}

  const bestWpm = Math.max(...sessions.map(s => s.wpm))
  const bestAccuracy = Math.max(...sessions.map(s => s.accuracy))
  const totalTests = sessions.length
  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalChars = sessions.reduce((sum, s) => sum + s.stats.charactersTyped, 0)

  const bestWpmByMode = sessions.reduce((acc, session) => {
    if (!acc[session.mode] || session.wpm > acc[session.mode]) {
      acc[session.mode] = session.wpm
    }
    return acc
  }, {} as Record<TestMode, number>)

  return {
    bestWpm,
    bestAccuracy,
    totalTestsCompleted: totalTests,
    totalTimeTyped: totalTime,
    totalCharsTyped: totalChars,
    bestWpmByMode
  }
}