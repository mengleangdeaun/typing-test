import React from 'react'
import { cn } from '../../lib/utils'

interface TypingSnapshotProps {
  targetText: string
  typedText: string
}

const TypingSnapshot: React.FC<TypingSnapshotProps> = ({ targetText, typedText }) => {
  // Segment by grapheme cluster — same logic as TypingDisplay for Khmer support
  const segments = React.useMemo(() => {
    if (!targetText) return []
    try {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
      return Array.from(segmenter.segment(targetText))
    } catch {
      return targetText.split('').map((char, index) => ({ segment: char, index }))
    }
  }, [targetText])

  const reachedChars = typedText.length
  const totalChars = targetText.length
  const percentReached = totalChars > 0 ? Math.round((reachedChars / totalChars) * 100) : 0

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Where you stopped
        </h4>
        <span className="text-xs font-mono text-muted-foreground/70 bg-muted/40 px-2 py-0.5">
          {reachedChars} / {totalChars} chars &nbsp;·&nbsp; {percentReached}%
        </span>
      </div>

      {/* Snapshot box */}
      <div className="relative border border-muted/20 bg-muted/10 max-h-[180px] overflow-y-auto p-4 font-mono text-base leading-relaxed break-words select-none scroll-smooth">
        {segments.map((seg, index) => {
          const char = seg.segment
          const startIndex = seg.index
          const endIndex = startIndex + char.length

          const isFullyTyped = typedText.length >= endIndex
          const isCursor = typedText.length >= startIndex && typedText.length < endIndex

          // Determine correctness for typed range
          let isCorrect = true
          const typedRangeLength = Math.min(typedText.length, endIndex) - startIndex
          if (typedRangeLength > 0) {
            for (let offset = 0; offset < typedRangeLength; offset++) {
              if (typedText[startIndex + offset] !== targetText[startIndex + offset]) {
                isCorrect = false
                break
              }
            }
          }

          let className = 'transition-colors duration-75'

          if (isCursor) {
            // The exact character where the cursor stopped
            className = cn(
              className,
              'border-l-2 border-primary',
              typedRangeLength > 0 && !isCorrect
                ? 'text-destructive bg-destructive/10'
                : 'text-muted-foreground/40'
            )
          } else if (isFullyTyped) {
            className = cn(
              className,
              isCorrect
                ? 'text-foreground'
                : 'text-destructive bg-destructive/10 px-0.5'
            )
          } else {
            // Not yet reached
            className = cn(className, 'text-muted-foreground/25')
          }

          if (char === ' ') {
            return (
              <span key={index} className={cn(className, 'inline-block w-2.5')}>
                &nbsp;
              </span>
            )
          }

          if (char === '\n') {
            return <br key={index} />
          }

          return (
            <span key={index} className={className}>
              {char}
            </span>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground/60 font-sans">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-foreground/60" />
          Correct
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-destructive/70" />
          Error
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/20" />
          Not reached
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-0.5 h-3 bg-primary rounded-full" />
          Cursor
        </span>
      </div>
    </div>
  )
}

export default TypingSnapshot
