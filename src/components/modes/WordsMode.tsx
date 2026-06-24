import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Progress } from '../ui/progress'
import { cn } from '../../lib/utils'

interface WordsModeProps {
  wordCount: number
  currentWordIndex: number
  wordHistory: Array<{ word: string; typed: string; correct: boolean; time: number }>
  targetWords: string[]
}

const WordsMode: React.FC<WordsModeProps> = ({
  wordCount,
  currentWordIndex,
  wordHistory,
  targetWords
}) => {
  const progress = (currentWordIndex / wordCount) * 100
  const correctWords = wordHistory.filter(w => w.correct).length
  const accuracy = wordHistory.length > 0 
    ? Math.round((correctWords / wordHistory.length) * 100) 
    : 0

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Word {Math.min(currentWordIndex + 1, wordCount)} of {wordCount}
        </span>
        <span className="text-muted-foreground">
          Accuracy: {accuracy}%
        </span>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 text-lg font-mono">
            {targetWords.map((word, index) => {
              const history = wordHistory[index]
              let className = 'px-2 py-1 rounded transition-colors'
              
              if (index < currentWordIndex) {
                className = cn(className, history?.correct ? 'text-green-600' : 'text-destructive bg-destructive/10')
              } else if (index === currentWordIndex) {
                className = cn(className, 'bg-primary/10 text-primary border-b-2 border-primary')
              } else {
                className = cn(className, 'text-muted-foreground/50')
              }

              return (
                <span key={index} className={className}>
                  {word}
                </span>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WordsMode