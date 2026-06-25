import React from 'react'
import type { TestStats, TestMode } from '../../types'
import { cn, getWpmColor, getAccuracyColor } from '../../lib/utils'

interface LiveStatsProps {
  stats: TestStats | null
  timeLeft?: number
  progress?: number
  mode: TestMode
  wordCount?: number
}

const LiveStats: React.FC<LiveStatsProps> = ({ stats, timeLeft, progress, mode, wordCount = 25 }) => {
  if (!stats) {
    return (
      <div className="space-y-2 select-none py-2 border-b border-muted/10">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-2 font-mono text-muted-foreground/60 flex-wrap">
          {/* Left: timer / counter + label */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <span className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
              {mode === 'words' ? `0/${wordCount}` : mode === 'zen' ? '∞' : `${timeLeft !== undefined ? timeLeft : '-'}s`}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground/50 font-sans tracking-wide truncate">
              {mode === 'zen' ? 'Zen Mode' : 'Ready to start'}
            </span>
          </div>

          {/* Right: stat chips */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs font-medium">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-0 sm:gap-1.5">
              <span className="text-muted-foreground/50 text-[9px] sm:text-[10px] uppercase tracking-wider">WPM</span>
              <span className="font-bold text-sm sm:text-base text-foreground/30">-</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-0 sm:gap-1.5">
              <span className="text-muted-foreground/50 text-[9px] sm:text-[10px] uppercase tracking-wider">ACC</span>
              <span className="font-bold text-sm sm:text-base text-foreground/30">-</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-0 sm:gap-1.5">
              <span className="text-muted-foreground/50 text-[9px] sm:text-[10px] uppercase tracking-wider">ERR</span>
              <span className="font-bold text-sm sm:text-base text-foreground/30">-</span>
            </div>
          </div>
        </div>

        {/* Progress Bar - Empty State */}
        <div className="w-full h-1 bg-gray-900/20 dark:bg-gray-100/20">
          <div className="h-full bg-primary/30 transition-all duration-300" style={{ width: '0%' }} />
        </div>
      </div>
    )
  }

  const progressPercent = Math.min(progress || 0, 100)

  return (
    <div className="space-y-2 select-none py-2 border-b border-muted/10">
      {/* Top Row */}
      <div className="flex items-center justify-between gap-2 font-mono text-muted-foreground/60 flex-wrap">
        {/* Left: timer / counter + progress label */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {mode === 'words' ? (
            <span className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
              {stats.correctWords}/{wordCount}
            </span>
          ) : (
            <span className={cn(
              "text-xl sm:text-2xl font-bold transition-colors whitespace-nowrap",
              mode !== 'zen' && timeLeft !== undefined && timeLeft < 10 ? "text-destructive animate-pulse" : "text-primary"
            )}>
              {mode === 'zen' ? '∞' : timeLeft !== undefined ? `${timeLeft}s` : '-'}
            </span>
          )}
          <span className="text-[10px] sm:text-xs text-muted-foreground/50 font-sans tracking-wide truncate">
            {mode === 'zen' ? 'Zen Mode' : `${Math.round(progressPercent)}% done`}
          </span>
        </div>

        {/* Right: WPM / ACC / ERRORS chips */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs font-medium">
          <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1.5">
            <span className="text-muted-foreground/50 text-[9px] sm:text-[10px] uppercase tracking-wider">WPM</span>
            <span className={cn("font-bold text-sm sm:text-base", getWpmColor(stats.wpm))}>
              {stats.wpm}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1.5">
            <span className="text-muted-foreground/50 text-[9px] sm:text-[10px] uppercase tracking-wider">ACC</span>
            <span className={cn("font-bold text-sm sm:text-base", getAccuracyColor(stats.accuracy))}>
              {stats.accuracy}%
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-1.5">
            <span className="text-muted-foreground/50 text-[9px] sm:text-[10px] uppercase tracking-wider">ERR</span>
            <span className="font-bold text-sm sm:text-base text-destructive">
              {stats.incorrectChars}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-900/10 dark:bg-gray-100/20">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            progressPercent >= 100 ? "bg-green-500" : "bg-primary"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}

export default LiveStats