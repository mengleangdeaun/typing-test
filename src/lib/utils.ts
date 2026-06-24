import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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