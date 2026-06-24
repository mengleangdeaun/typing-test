import React from 'react'
import { cn } from '../../lib/utils'
import { getPracticeTexts } from '../../services/textService'
import { ScrollArea } from '../ui/scroll-area'

interface PracticePickerProps {
  activeLanguage: 'english' | 'khmer' | 'mixed'
  selectedIndex: number
  onSelect: (index: number, language: 'english' | 'khmer' | 'mixed') => void
  disabled?: boolean
}

const PracticePicker: React.FC<PracticePickerProps> = ({
  activeLanguage,
  selectedIndex,
  onSelect,
  disabled = false,
}) => {
  const englishParagraphs = getPracticeTexts('english')
  const khmerParagraphs = getPracticeTexts('khmer')
  const mixedParagraphs = getPracticeTexts('mixed')

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase text-muted-foreground/80 font-medium tracking-wide">
        Select Paragraph
      </label>

      {/* Scrollable list containing English, Khmer, and Mixed paragraphs */}
      <ScrollArea className="h-[280px] bg-muted/10">
        <div className="p-0 space-y-3">
          {/* English Section */}
          <div className="space-y-0">
            <div className="sticky top-0 bg-card z-10 px-2.5 py-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider border-b flex items-center justify-between">
              <span>English Paragraphs</span>
              <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground/80 normal-case font-medium">{englishParagraphs.length} items</span>
            </div>
            <div className="pt-1">
              {englishParagraphs.map((text, i) => {
                const isSelected = activeLanguage === 'english' && selectedIndex === i
                return (
                  <button
                    key={`en-${i}`}
                    type="button"
                    onClick={() => !disabled && onSelect(i, 'english')}
                    disabled={disabled}
                    className={cn(
                      'w-full text-left px-2.5 py-1.5 text-[11px] leading-snug transition-colors duration-100',
                      'border-l-2 focus:outline-none block',
                      isSelected
                        ? 'border-l-primary bg-primary/10 text-foreground font-semibold'
                        : 'border-l-transparent bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-l-muted-foreground',
                      disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                    )}
                  >
                    <span className="text-[9px] font-bold text-primary/60 mr-1.5 tabular-nums select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      {text.length > 65 ? text.slice(0, 65) + '…' : text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Khmer Section */}
          <div className="space-y-0.5">
            <div className="sticky top-0 bg-card z-10 px-2.5 py-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider border-b flex items-center justify-between">
              <span>Khmer Paragraphs</span>
              <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground/80 normal-case font-medium">{khmerParagraphs.length} items</span>
            </div>
            <div className="pt-1">
              {khmerParagraphs.map((text, i) => {
                const isSelected = activeLanguage === 'khmer' && selectedIndex === i
                return (
                  <button
                    key={`km-${i}`}
                    type="button"
                    onClick={() => !disabled && onSelect(i, 'khmer')}
                    disabled={disabled}
                    className={cn(
                      'w-full text-left px-2.5 py-1.5 text-[11px] leading-snug transition-colors duration-100',
                      'border-l-2 focus:outline-none block',
                      isSelected
                        ? 'border-l-primary bg-primary/10 text-foreground font-semibold'
                        : 'border-l-transparent bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-l-muted-foreground',
                      disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                    )}
                  >
                    <span className="text-[9px] font-bold text-primary/60 mr-1.5 tabular-nums select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      {text.length > 65 ? text.slice(0, 65) + '…' : text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mixed Section */}
          <div className="space-y-0.5">
            <div className="sticky top-0 bg-card z-10 px-2.5 py-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider border-b flex items-center justify-between">
              <span>Mixed Paragraphs</span>
              <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground/80 normal-case font-medium">{mixedParagraphs.length} items</span>
            </div>
            <div className="pt-1">
              {mixedParagraphs.map((text, i) => {
                const isSelected = activeLanguage === 'mixed' && selectedIndex === i
                return (
                  <button
                    key={`mx-${i}`}
                    type="button"
                    onClick={() => !disabled && onSelect(i, 'mixed')}
                    disabled={disabled}
                    className={cn(
                      'w-full text-left px-2.5 py-1.5 text-[11px] leading-snug transition-colors duration-100',
                      'border-l-2 focus:outline-none block',
                      isSelected
                        ? 'border-l-primary bg-primary/10 text-foreground font-semibold'
                        : 'border-l-transparent bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-l-muted-foreground',
                      disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                    )}
                  >
                    <span className="text-[9px] font-bold text-primary/60 mr-1.5 tabular-nums select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      {text.length > 65 ? text.slice(0, 65) + '…' : text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      <p className="text-[10px] text-muted-foreground/45 pt-0.5">
        {englishParagraphs.length + khmerParagraphs.length + mixedParagraphs.length} paragraphs available total
      </p>
    </div>
  )
}

export default PracticePicker
