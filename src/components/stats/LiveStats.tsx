import React from 'react'
import type { TestStats } from '../../types'
import { cn, getWpmColor, getAccuracyColor } from '../../lib/utils'

interface LiveStatsProps {
  stats: TestStats | null
  timeLeft?: number
  progress?: number
  mode: 'time' | 'words' | 'quote' | 'zen' | 'custom'
  wordCount?: number
}

const LiveStats: React.FC<LiveStatsProps> = ({ stats, timeLeft, progress, mode, wordCount = 25 }) => {
  if (!stats) {
    return (
      <div className="space-y-2 select-none py-2 border-b border-muted/10">
        {/* Top Row */}
        <div className="flex items-center justify-between font-mono text-muted-foreground/60">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary">
              {mode === 'words' ? `0/${wordCount}` : mode === 'zen' ? '∞' : `${timeLeft !== undefined ? timeLeft : '-'}s`}
            </span>
            <span className="text-xs text-muted-foreground/50 font-sans tracking-wide">
              {mode === 'zen' ? 'Zen Mode' : 'Ready to start'}
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs md:text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/50 text-[10px] uppercase tracking-wider">WPM</span>
              <span className="font-bold text-base text-foreground/30">-</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/50 text-[10px] uppercase tracking-wider">ACC</span>
              <span className="font-bold text-base text-foreground/30">-</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/50 text-[10px] uppercase tracking-wider">ERRORS</span>
              <span className="font-bold text-base text-foreground/30">-</span>
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
      <div className="flex items-center justify-between font-mono text-muted-foreground/60">
        <div className="flex items-center gap-4">
          {mode === 'words' ? (
            <span className="text-2xl font-bold text-primary">
              {stats.correctWords}/{wordCount}
            </span>
          ) : (
            <span className={cn(
              "text-2xl font-bold transition-colors",
              mode !== 'zen' && timeLeft !== undefined && timeLeft < 10 ? "text-destructive animate-pulse" : "text-primary"
            )}>
              {mode === 'zen' ? '∞' : timeLeft !== undefined ? `${timeLeft}s` : '-'}
            </span>
          )}
          <span className="text-xs text-muted-foreground/50 font-sans tracking-wide">
            {mode === 'zen' ? 'Zen Mode' : `${Math.round(progressPercent)}% complete`}
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs md:text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground/50 text-[10px] uppercase tracking-wider">WPM</span>
            <span className={cn("font-bold text-base", getWpmColor(stats.wpm))}>
              {stats.wpm}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground/50 text-[10px] uppercase tracking-wider">ACC</span>
            <span className={cn("font-bold text-base", getAccuracyColor(stats.accuracy))}>
              {stats.accuracy}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground/50 text-[10px] uppercase tracking-wider">ERRORS</span>
            <span className="font-bold text-base text-destructive">
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