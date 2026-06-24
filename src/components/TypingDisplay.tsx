import React from 'react'
import { cn } from '../lib/utils'
import { Keyboard } from 'lucide-react'

interface TypingDisplayProps {
  targetText: string
  typedText: string
  showCursor?: boolean
  mode?: 'time' | 'words' | 'quote' | 'zen' | 'custom'
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
  // Split text into characters for rendering
  const targetChars = targetText.split('')
  
  return (
    <div 
      className="relative p-6 md:p-8 min-h-[160px] text-xl md:text-2xl leading-relaxed font-mono select-none break-words transition-all cursor-text rounded-none bg-card/20 border border-muted/20"
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
        {targetChars.map((char, index) => {
          const isTyped = index < typedText.length
          const isCurrent = index === typedText.length
          
          let className = 'transition-colors duration-100'
          
          if (isTyped) {
            // Character has been typed
            if (typedText[index] === char) {
              className = cn(className, 'text-foreground')
            } else {
              className = cn(className, 'text-destructive bg-destructive/10 rounded-none px-0.5')
            }
          } else if (isCurrent && showCursor) {
            // Current cursor position - show blinking left border cursor
            className = cn(className, 'border-l-2 border-primary animate-pulse')
          } else {
            // Not yet typed
            className = cn(className, 'text-muted-foreground/35')
          }

          // Special handling for spaces
          if (char === ' ') {
            return (
              <span key={index} className={cn(className, 'inline-block w-2.5')}>
                &nbsp;
              </span>
            )
          }

          // Handle newlines for quote mode
          if (mode === 'quote' && char === '\n') {
            return <br key={index} />
          }

          return (
            <span key={index} className={className}>
              {char}
            </span>
          )
        })}
        
        {/* Show cursor at end if text is empty and idle */}
        {targetText.length === 0 && showCursor && (
          <span className="border-l-2 border-primary animate-pulse"> </span>
        )}
      </div>

      {/* Focus Overlay */}
      {!isFocused && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px] transition-all duration-300 rounded-none select-none cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 bg-background border border-muted/50 rounded-none text-xs md:text-sm shadow-md animate-in fade-in zoom-in-95 duration-200">
            <Keyboard className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-muted-foreground font-sans font-medium">Click or press any key to focus</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TypingDisplay