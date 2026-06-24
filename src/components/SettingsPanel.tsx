import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import type { TestMode, TimerDuration, Difficulty } from '../types'
import { Label } from './ui/label'
import PracticePicker from './modes/PracticePicker'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  mode: TestMode
  onModeChange: (mode: TestMode) => void
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  language: 'english' | 'khmer' | 'mixed'
  onLanguageChange: (language: 'english' | 'khmer' | 'mixed') => void
  timerDuration: TimerDuration
  onTimerDurationChange: (duration: TimerDuration) => void
  wordCount: 10 | 25 | 50 | 100
  onWordCountChange: (count: 10 | 25 | 50 | 100) => void
  customText: string
  onCustomTextChange: (text: string) => void
  soundEnabled: boolean
  onSoundToggle: (enabled: boolean) => void
  onReset: () => void
  status: 'idle' | 'running' | 'finished'
  // Practice mode
  practiceIndex: number
  onPracticeIndexChange: (index: number, language: 'english' | 'khmer' | 'mixed') => void
  practiceTimed: boolean
  onPracticeTimedChange: (timed: boolean) => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
  difficulty,
  onDifficultyChange,
  language,
  onLanguageChange,
  timerDuration,
  onTimerDurationChange,
  wordCount,
  onWordCountChange,
  customText,
  onCustomTextChange,
  soundEnabled,
  onSoundToggle,
  onReset,
  status,
  practiceIndex,
  onPracticeIndexChange,
  practiceTimed,
  onPracticeTimedChange,
}) => {
  if (!isOpen) return null

  const isDisabled = status === 'running'

  return (
    <Card className=" bg-card shadow-none border">
      <CardContent className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-muted/20 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Test Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 lg:hidden text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        </div>

        {/* Settings Stack */}
        <div className="space-y-4">
          {/* Mode Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground/80">Test Mode</Label>
            <Select
              value={mode}
              onValueChange={(v) => onModeChange(v as TestMode)}
              disabled={isDisabled}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Time Test</SelectItem>
                <SelectItem value="words">Words Test</SelectItem>
                <SelectItem value="quote">Quote Test</SelectItem>
                <SelectItem value="zen">Zen Mode</SelectItem>
                <SelectItem value="custom">Custom Text</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground/80">Difficulty Level</Label>
            <Select
              value={difficulty}
              onValueChange={(v) => onDifficultyChange(v as Difficulty)}
              disabled={isDisabled}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground/80">Language</Label>
            <Select
              value={language}
              onValueChange={(v) => onLanguageChange(v as 'english' | 'khmer' | 'mixed')}
              disabled={isDisabled}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="khmer">Khmer</SelectItem>
                <SelectItem value="mixed">Mixed (Bilingual)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timer Duration (time mode) */}
          {mode === 'time' && (
            <div className="space-y-1.5">
              <Label className="text-xs uppercase text-muted-foreground/80">Duration</Label>
              <Select
                value={String(timerDuration)}
                onValueChange={(v) => onTimerDurationChange(Number(v) as TimerDuration)}
                disabled={isDisabled}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Seconds</SelectItem>
                  <SelectItem value="30">30 Seconds</SelectItem>
                  <SelectItem value="60">60 Seconds</SelectItem>
                  <SelectItem value="120">2 Minutes</SelectItem>
                  <SelectItem value="180">3 Minutes</SelectItem>
                  <SelectItem value="240">4 Minutes</SelectItem>
                  <SelectItem value="300">5 Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Word Count (words mode) */}
          {mode === 'words' && (
            <div className="space-y-1.5">
              <Label className="text-xs uppercase text-muted-foreground/80">Word Count</Label>
              <Select
                value={String(wordCount)}
                onValueChange={(v) => onWordCountChange(Number(v) as 10 | 25 | 50 | 100)}
                disabled={isDisabled}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Words</SelectItem>
                  <SelectItem value="25">25 Words</SelectItem>
                  <SelectItem value="50">50 Words</SelectItem>
                  <SelectItem value="100">100 Words</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Practice Mode Options */}
          {mode === 'practice' && (
            <>
              {/* Timer Toggle */}
              <div className="space-y-1.5">
                <Label className="text-xs uppercase text-muted-foreground/80">Timer</Label>
                <Select
                  value={practiceTimed ? 'on' : 'off'}
                  onValueChange={(v) => onPracticeTimedChange(v === 'on')}
                  disabled={isDisabled}
                >
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off — finish when done</SelectItem>
                    <SelectItem value="on">On — countdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration (only shown when timer is on) */}
              {practiceTimed && (
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase text-muted-foreground/80">Duration</Label>
                  <Select
                    value={String(timerDuration)}
                    onValueChange={(v) => onTimerDurationChange(Number(v) as TimerDuration)}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 Seconds</SelectItem>
                      <SelectItem value="30">30 Seconds</SelectItem>
                      <SelectItem value="60">60 Seconds</SelectItem>
                      <SelectItem value="120">2 Minutes</SelectItem>
                      <SelectItem value="180">3 Minutes</SelectItem>
                      <SelectItem value="240">4 Minutes</SelectItem>
                      <SelectItem value="300">5 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {/* Sound Effects Toggle */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground/80">Sound Effects</Label>
            <Select
              value={soundEnabled ? 'on' : 'off'}
              onValueChange={(v) => onSoundToggle(v === 'on')}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on">On</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Custom Text Input */}
        {mode === 'custom' && (
          <div className="space-y-1.5 pt-3 border-t border-muted/20">
            <Label className="text-xs uppercase text-muted-foreground/80">Custom Text</Label>
            <textarea
              value={customText}
              onChange={(e) => onCustomTextChange(e.target.value)}
              placeholder="Enter custom text..."
              className="w-full min-h-[100px] rounded-none border border-input bg-background/50 px-3 py-2 text-xs font-sans resize-y focus:outline-none focus:ring-1 focus:ring-ring"
              disabled={isDisabled}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/75">
              <span>{customText.split(' ').filter(w => w.length > 0).length} words</span>
              <span>{customText.length} chars</span>
            </div>
          </div>
        )}

        {/* Practice Paragraph Picker */}
        {mode === 'practice' && (
          <div className="pt-3 border-t border-muted/20">
            <PracticePicker
              activeLanguage={language}
              selectedIndex={practiceIndex}
              onSelect={onPracticeIndexChange}
              disabled={isDisabled}
            />
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 pt-3 border-t border-muted/20">
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            className="w-full h-8 text-xs font-medium"
          >
            Reset Test
          </Button>
          {status === 'running' && (
            <span className="text-[10px] text-destructive text-center font-medium animate-pulse mt-1">
              Settings locked while typing
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SettingsPanel