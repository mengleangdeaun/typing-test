import React from 'react'
import type { TestStats, TestMode } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { RotateCcw, TrendingUp, Target, Clock, Zap } from 'lucide-react'
import { getWpmColor, getAccuracyColor } from '../lib/utils'
import SpeedGraph from './stats/SpeedGraph'
import TypingSnapshot from './stats/TypingSnapshot'

interface ResultsDisplayProps {
  stats: TestStats | null
  mode: TestMode
  wpmHistory: Array<{ time: number; wpm: number }>
  onRestart: () => void
  onChangeMode: (mode: TestMode) => void
  typedText: string
  targetText: string
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  stats,
  wpmHistory,
  onRestart,
  onChangeMode,
  typedText,
  targetText
}) => {
  if (!stats) return null

  const resultCards = [
    {
      label: 'WPM',
      value: stats.wpm,
      color: getWpmColor(stats.wpm),
      icon: Zap
    },
    {
      label: 'Accuracy',
      value: `${stats.accuracy}%`,
      color: getAccuracyColor(stats.accuracy),
      icon: Target
    },
    {
      label: 'Characters',
      value: stats.charactersTyped,
      color: 'text-foreground',
      icon: Clock
    },
    {
      label: 'Time',
      value: `${Math.round(stats.totalTime)}s`,
      color: 'text-foreground',
      icon: Clock
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Test Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {resultCards.map((item) => (
              <div key={item.label} className="text-center p-4 bg-muted/50">
                <div className="text-3xl font-bold mb-1">
                  <span className={item.color}>{item.value}</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between p-2 bg-muted/30 rounded-none">
              <span className="text-muted-foreground">Net WPM</span>
              <span className="font-medium">{stats.netWpm}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded-none">
              <span className="text-muted-foreground">Raw WPM</span>
              <span className="font-medium">{stats.rawWpm}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded-none">
              <span className="text-muted-foreground">Consistency</span>
              <span className="font-medium">{stats.consistency}%</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/30 rounded-none">
              <span className="text-muted-foreground">Errors</span>
              <span className="font-medium text-destructive">{stats.incorrectChars}</span>
            </div>
          </div>

          {stats.mostCommonErrors.length > 0 && (
            <div className="p-4 bg-muted/30">
              <h4 className="text-sm font-medium mb-2">Most Common Errors</h4>
              <div className="flex flex-wrap gap-2">
                {stats.mostCommonErrors.map((error) => (
                  <div key={error.char} className="flex items-center gap-1 px-3 py-1 bg-background text-sm">
                    <span className="font-mono font-medium">{error.char}</span>
                    <span className="text-muted-foreground">×{error.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Typing Snapshot — only shown when user didn't finish the full text */}
          {typedText.length < targetText.length && (
            <div className="pt-2 border-t border-muted/20">
              <TypingSnapshot targetText={targetText} typedText={typedText} />
            </div>
          )}

          <SpeedGraph data={wpmHistory} height={120} />

          <div className="flex flex-wrap gap-3 pt-4">
            <Button onClick={onRestart} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart Test
            </Button>
            <Button variant="outline" onClick={() => onChangeMode('time')}>
              Time
            </Button>
            <Button variant="outline" onClick={() => onChangeMode('words')}>
              Words
            </Button>
            <Button variant="outline" onClick={() => onChangeMode('quote')}>
              Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResultsDisplay