import React from 'react'
import { cn } from '../lib/utils'
import { normalizeText, segmentGraphemes } from '../lib/utils'
import { Keyboard } from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'
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
  // Segment both texts into grapheme clusters (handles Khmer multi-codepoint characters)
  const targetGraphemes = React.useMemo(
    () => segmentGraphemes(normalizeText(targetText)),
    [targetText]
  )

  const typedGraphemesArr = React.useMemo(
    () => segmentGraphemes(normalizeText(typedText)),
    [typedText]
  )

  // Detect if the last typed grapheme is a valid prefix of its target grapheme.
  const lastTypedIdx = typedGraphemesArr.length - 1
  const isLastInProgress =
    lastTypedIdx >= 0 &&
    targetGraphemes[lastTypedIdx] !== undefined &&
    typedGraphemesArr[lastTypedIdx] !== targetGraphemes[lastTypedIdx] &&
    targetGraphemes[lastTypedIdx].startsWith(typedGraphemesArr[lastTypedIdx])

  // Committed graphemes: fully past (excludes the in-progress one if any)
  const commitCount = isLastInProgress
    ? typedGraphemesArr.length - 1
    : typedGraphemesArr.length

  // Ghost text (remaining target) starts after all typed positions
  const ghostStartIndex = typedGraphemesArr.length

  return (
    <div
      className="relative select-none transition-all cursor-text rounded-none bg-card/20 border border-muted/20 flex flex-col"
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
      {/* ScrollArea constraint wrapper */}
      <ScrollArea className="w-full h-full max-h-[55vh] md:max-h-[60vh]">
        <div className="p-6 md:p-8 min-h-[160px]">
          {/* Main text area — word-processor style */}
          <div
            className={cn(
              'text-xl md:text-2xl leading-loose font-sans tracking-wide transition-all duration-300',
              !isFocused && 'blur-[1.5px] opacity-40'
            )}
          >
            {/* ── Left of cursor: what the user actually typed ─────────────────── */}
            {typedGraphemesArr.slice(0, commitCount).map((glyph, i) => {
              const targetGlyph = targetGraphemes[i]
              const isCorrect = glyph === targetGlyph

              // Newline in quote mode
              if (mode === 'quote' && targetGlyph === '\n') {
                return <br key={`t-${i}`} />
              }

              if (isCorrect) {
                // Correctly typed — looks like normal document text
                return (
                  <span key={`t-${i}`} className="text-foreground">
                    {glyph}
                  </span>
                )
              }

              // Incorrectly typed — show typed char in red with wavy underline (spell-check style)
              return (
                <span
                  key={`t-${i}`}
                  className="text-destructive underline decoration-wavy decoration-destructive/70"
                >
                  {glyph === ' ' ? '\u00A0' /* non-breaking space so underline shows */ : glyph}
                </span>
              )
            })}

            {/* ── Cursor ──────────────────────────────────────────────────────── */}
            {showCursor && (
              <span
                className="inline-block w-[2px] -mx-[1px] bg-primary animate-pulse rounded-full"
                style={{ height: '1.15em', verticalAlign: 'text-bottom' }}
                aria-hidden="true"
              />
            )}

            {/* ── In-progress Khmer syllable (at cursor position) ────────────── */}
            {isLastInProgress && targetGraphemes[lastTypedIdx] && (
              <span className="text-muted-foreground/50">
                {targetGraphemes[lastTypedIdx]}
              </span>
            )}

            {/* ── Right of cursor: remaining target as ghost / hint text ───────── */}
            {targetGraphemes.slice(ghostStartIndex).map((glyph, i) => {
              const absIndex = ghostStartIndex + i

              if (mode === 'quote' && glyph === '\n') {
                return <br key={`g-${absIndex}`} />
              }

              return (
                <span key={`g-${absIndex}`} className="text-muted-foreground/30">
                  {glyph}
                </span>
              )
            })}

            {/* Empty state cursor */}
            {targetText.length === 0 && showCursor && (
              <span
                className="inline-block w-[2px] bg-primary animate-pulse rounded-full"
                style={{ height: '1.15em', verticalAlign: 'text-bottom' }}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Focus Overlay */}
      {!isFocused && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/10 transition-all duration-300 rounded-none select-none cursor-pointer z-10 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 px-4 py-2 bg-background border border-muted/50 shadow-sm rounded-none text-xs md:text-sm animate-in fade-in zoom-in-95 duration-200">
            <Keyboard className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-muted-foreground font-sans font-medium">
              Click or press any key to focus
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TypingDisplay