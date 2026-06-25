import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Splits a string into grapheme clusters (user-perceived characters).
 * Critical for Khmer script, where a single visible character is often
 * composed of multiple Unicode code points.
 */
export const segmentGraphemes = (text: string): string[] => {
  if (!text) return []
  try {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return Array.from(segmenter.segment(text)).map(s => s.segment)
  } catch {
    // Fallback: split by code point (better than split('') for emoji/surrogate pairs)
    return [...text]
  }
}

/**
 * Applies Unicode NFC normalization so that combining sequences produced
 * by different Khmer IMEs compare equal when they are visually identical.
 */
export const normalizeText = (text: string): string => {
  try {
    return text.normalize('NFC')
  } catch {
    return text
  }
}

export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

export const formatNumber = (num: number): string => {
  return Math.round(num).toString()
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const getDifficultyColor = (difficulty: string): string => {
  const colors = {
    beginner: 'text-green-500',
    intermediate: 'text-yellow-500',
    advanced: 'text-orange-500',
    expert: 'text-red-500'
  }
  return colors[difficulty as keyof typeof colors] || 'text-gray-500'
}

export const getWpmColor = (wpm: number): string => {
  if (wpm < 30) return 'text-red-500'
  if (wpm < 50) return 'text-orange-500'
  if (wpm < 70) return 'text-yellow-500'
  if (wpm < 90) return 'text-green-500'
  return 'text-emerald-500'
}

export const getAccuracyColor = (accuracy: number): string => {
  if (accuracy < 70) return 'text-red-500'
  if (accuracy < 80) return 'text-orange-500'
  if (accuracy < 90) return 'text-yellow-500'
  if (accuracy < 95) return 'text-green-500'
  return 'text-emerald-500'
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const calculateProgress = (typed: number, total: number): number => {
  return Math.min((typed / total) * 100, 100)
}