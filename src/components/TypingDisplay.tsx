import React from 'react'
import { cn } from '../lib/utils'
import { Keyboard } from 'lucide-react'
import type { TestMode } from '../types'

interface TypingDisplayProps {
  targetText: string
  typedText: string
  showCursor?: boolean
  mode?: TestMode
  onDisplayClick?: () => void
  isFocused?: boolean
}

const TypingDisplay: React.FC<TypingDisplayProps> = ({
  targetText,
  typedText,
  showCursor = true,
  mode = 'time',
  onDisplayClick,
  isFocused = true
}) => {
  // Segment targetText by grapheme clusters (user-perceived characters)
  // This prevents complex Khmer combining characters from rendering brokenly.
  const segments = React.useMemo(() => {
    if (!targetText) return []
    try {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
      return Array.from(segmenter.segment(targetText))
    } catch (e) {
      // Fallback if Intl.Segmenter is not available in the environment
      return targetText.split('').map((char, index) => ({
        segment: char,
        index
      }))
    }
  }, [targetText])

  return (
    <div
      className="relative p-6 md:p-8 min-h-[160px] text-xl md:text-2xl leading-relaxed font-mono select-none wrap-break-words transition-all cursor-text rounded-none bg-card/20 border border-muted/20"
      onClick={onDisplayClick}
      role="textbox"
      aria-label="Typing display"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onDisplayClick?.()
        }
      }}
    >
      {/* Target characters */}
      <div className={cn(
        "transition-all duration-300",
        !isFocused && "blur-[1.5px] opacity-40"
      )}>
        {segments.map((seg, index) => {
          const char = seg.segment
          const startIndex = seg.index
          const endIndex = startIndex + char.length

          const isFullyTyped = typedText.length >= endIndex
          const isCurrent = typedText.length >= startIndex && typedText.length < endIndex

          // Determine correctness of whatever has been typed for this segment so far
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

          // Build className WITHOUT any cursor border — cursor is a separate element
          let charClassName = 'transition-colors duration-100'

          if (isFullyTyped) {
            charClassName = cn(charClassName, isCorrect
              ? 'text-foreground'
              : 'text-destructive bg-destructive/10'
            )
          } else if (isCurrent) {
            charClassName = cn(charClassName,
              typedRangeLength > 0 && !isCorrect
                ? 'text-destructive bg-destructive/10'
                : 'text-muted-foreground/35'
            )
          } else {
            charClassName = cn(charClassName, 'text-muted-foreground/35')
          }

          // Cursor: a standalone 2px bar with -2px right margin → zero net layout width.
          // Inserted BEFORE the current character so no surrounding char shifts.
          const cursorEl = (isCurrent && showCursor) ? (
            <span
              className="inline-block w-0.5 -mr-0.5 bg-primary animate-pulse align-text-bottom"
              style={{ height: '1.1em' }}
              aria-hidden="true"
            />
          ) : null

          // Handle newlines for quote mode
          if (mode === 'quote' && char === '\n') {
            return <br key={index} />
          }

          // Spaces: empty fixed-width box — no content to overflow or shift
          if (char === ' ') {
            return (
              <React.Fragment key={index}>
                {cursorEl}
                <span className={cn(charClassName, 'inline-block w-[1ch] overflow-hidden')} />
              </React.Fragment>
            )
          }

          return (
            <React.Fragment key={index}>
              {cursorEl}
              <span className={charClassName}>{char}</span>
            </React.Fragment>
          )
        })}

        {/* Show cursor at start when text is empty and idle */}
        {targetText.length === 0 && showCursor && (
          <span
            className="inline-block w-0.5 bg-primary animate-pulse align-text-bottom"
            style={{ height: '1.1em' }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Focus Overlay */}
      {!isFocused && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/10 transition-all duration-300 rounded-none select-none cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 bg-background border border-muted/50 rounded-none text-xs md:text-sm animate-in fade-in zoom-in-95 duration-200">
            <Keyboard className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-muted-foreground font-sans font-medium">Click or press any key to focus</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TypingDisplay