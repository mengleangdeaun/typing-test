import { useState, useRef, useEffect } from 'react'
import { useTypingEngine } from './hooks/useTypingEngine'
import { useTheme } from './hooks/useTheme'
import { Button } from './components/ui/button'
import TypingDisplay from './components/TypingDisplay'
import LiveStats from './components/stats/LiveStats'
import ResultsDisplay from './components/ResultsDisplay'
import SettingsPanel from './components/SettingsPanel'
import SoundControls from './components/SoundControls'
import ExportControls from './components/ExportControls'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { registerSW } from './registerSW'
import type { TestMode, TimerDuration, Difficulty } from './types'
import { soundService } from './services/soundService'
import { cn } from './lib/utils'
import { RotateCcw, Settings, Sun, Moon, X } from 'lucide-react'

function App() {
  const [mode, setMode] = useState<TestMode>('time')
  const [language, setLanguage] = useState<'english' | 'khmer' | 'mixed'>('english')
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate')
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(30)
  const [wordCount, setWordCount] = useState<10 | 25 | 50 | 100>(25)
  const [customText, setCustomText] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const [practiceIndex, setPracticeIndex] = useState<number>(0)
  const [practiceTimed, setPracticeTimed] = useState<boolean>(false)

  const { theme, setTheme } = useTheme()
  const resultsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    registerSW()
  }, [])

  const {
    status,
    timeLeft,
    typedText,
    targetText,
    stats,
    wpmHistory,
    handleTyping,
    resetTest
  } = useTypingEngine({
    mode,
    language,
    difficulty,
    timerDuration,
    wordCount,
    customText,
    practiceIndex,
    practiceTimed
  })

  useEffect(() => {
    if (status === 'idle' || status === 'running') {
      inputRef.current?.focus()
    }
  }, [status])

  useEffect(() => {
    if (!soundEnabled || status !== 'running' || typedText.length === 0) return

    const lastChar = typedText[typedText.length - 1]
    const targetChar = targetText[typedText.length - 1]
    
    if (lastChar === targetChar) {
      soundService.playKeyCorrect()
    } else {
      soundService.playKeyError()
    }
  }, [typedText, status, targetText, soundEnabled])

  useEffect(() => {
    if (status === 'finished' && soundEnabled) {
      soundService.playTestComplete()
    }
  }, [status, soundEnabled])

  // Global key listener to auto-focus hidden input on typing start
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in another input (like custom text input)
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
         document.activeElement.tagName === 'TEXTAREA') &&
        document.activeElement !== inputRef.current
      ) {
        return
      }

      // Check for modifier keys to prevent capturing shortcuts
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return
      }

      // Avoid capturing special navigation keys or function keys
      if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Spacebar' && e.key !== 'Enter') {
        return
      }

      // Focus the hidden textarea
      if (status === 'idle' || status === 'running') {
        inputRef.current?.focus()
      }
    }
    
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [status])

  const handleRestart = () => {
    resetTest()
    inputRef.current?.focus()
  }

  const handleModeChange = (newMode: TestMode) => {
    setMode(newMode)
    resetTest()
  }

  // When language changes in Practice mode, reset to paragraph 0 of the new language
  const handleLanguageChange = (newLang: 'english' | 'khmer' | 'mixed') => {
    setLanguage(newLang)
    if (mode === 'practice') {
      setPracticeIndex(0)
    }
  }

  // When a paragraph is selected, update both index and language, and focus input immediately
  const handlePracticeIndexChange = (index: number, newLang: 'english' | 'khmer' | 'mixed') => {
    setLanguage(newLang)
    setPracticeIndex(index)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const progress = targetText.length > 0 
    ? (typedText.length / targetText.length) * 100 
    : 0

  const isFinished = status === 'finished'

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      {/* Mobile Settings Overlay */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowSettings(false)}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 w-full flex-1 flex flex-col">
        {/* Header - More compact and modern */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden">
              <img 
                src="/logo.svg" // or "/logo.png", "/favicon.ico", etc.
                alt="SCCG Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SCCG Typing Test</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Improve your typing speed and accuracy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Desktop controls */}
            <div className="hidden sm:flex items-center gap-2">
              <SoundControls />
              <ExportControls resultsRef={resultsRef} />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-8 bg-card w-8"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <Button 
              variant={showSettings ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
              className="gap-1.5 lg:hidden"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8">
          {/* Main Typing Area */}
          <div className="flex-1 min-w-0">
            {/* Live Statistics Bar */}
            {!isFinished && (
              <div className="mb-6">
                <LiveStats
                  stats={stats}
                  timeLeft={timeLeft}
                  progress={progress}
                  mode={mode}
                  wordCount={wordCount}
                />
              </div>
            )}

            {/* Typing Area */}
            {!isFinished && (
              <div ref={resultsRef} className="space-y-6">
                {/* Status Bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-card">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="font-medium capitalize">{mode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      status === 'running' && "bg-green-500 animate-pulse",
                      status === 'idle' && "bg-yellow-500"
                    )} />
                    <span className="font-medium capitalize">{status}</span>
                  </div>
                </div>

                {/* Typing Display */}
                <div className="border bg-card">
                  <TypingDisplay
                    targetText={targetText}
                    typedText={typedText}
                    showCursor={true}
                    mode={mode}
                    onDisplayClick={() => inputRef.current?.focus()}
                    isFocused={isFocused}
                  />
                </div>

                {/* Hidden input for capturing keystrokes */}
                <textarea
                  ref={inputRef}
                  value={typedText}
                  onChange={(e) => handleTyping(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="absolute opacity-0 w-0 h-0"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={handleRestart} 
                    variant="default"
                    className="px-6 py-6"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Test
                  </Button>
                </div>
              </div>
            )}

            {/* Results Display */}
            {isFinished && stats && (
              <div ref={resultsRef}>
                <ResultsDisplay
                  stats={stats}
                  mode={mode}
                  wpmHistory={wpmHistory}
                  onRestart={handleRestart}
                  onChangeMode={handleModeChange}
                />
              </div>
            )}
          </div>

          {/* Settings Sidebar */}
          <div className={cn(
            "lg:w-72 shrink-0",
            "fixed inset-y-0 right-0 z-50 lg:z-0",
            "w-80 lg:w-72",
            "bg-background lg:bg-transparent",
            "border-l lg:border-l-0",
            "transition-transform duration-300 ease-in-out lg:transition-none",
            showSettings ? "translate-x-0" : "translate-x-full lg:translate-x-0",
            "top-0 lg:top-0",
            "overflow-y-auto",
            "lg:max-h-[calc(100vh-6rem)] lg:sticky lg:self-start",
            "shadow-2xl lg:shadow-none"
          )}>
            {/* Mobile close button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Settings</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 lg:p-0">
              <SettingsPanel
                isOpen={true}
                onClose={() => setShowSettings(false)}
                mode={mode}
                onModeChange={handleModeChange}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                language={language}
                onLanguageChange={handleLanguageChange}
                timerDuration={timerDuration}
                onTimerDurationChange={setTimerDuration}
                wordCount={wordCount}
                onWordCountChange={setWordCount}
                customText={customText}
                onCustomTextChange={setCustomText}
                soundEnabled={soundEnabled}
                onSoundToggle={setSoundEnabled}
                onReset={handleRestart}
                status={status}
                practiceIndex={practiceIndex}
                onPracticeIndexChange={handlePracticeIndexChange}
                practiceTimed={practiceTimed}
                onPracticeTimedChange={setPracticeTimed}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground/60 py-6 mt-8 border-t">
          <p>SCCGroup Typing Test &copy; {new Date().getFullYear()} • Press any key to start typing • Esc to restart</p>
        </footer>
      </div>
      
      <PWAInstallPrompt />
    </div>
  )
}

export default App