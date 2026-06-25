import { useState, useRef, useEffect } from 'react'
import { segmentGraphemes, normalizeText } from './lib/utils'
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
import { ScrollArea } from './components/ui/scroll-area'
import { registerSW } from './registerSW'
import type { TestMode, TimerDuration, Difficulty } from './types'
import { soundService } from './services/soundService'
import { cn } from './lib/utils'
import { RotateCcw, Settings, Sun, Moon } from 'lucide-react'

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
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [status])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = 0
    }
  }, [typedText])

  useEffect(() => {
    if (!soundEnabled || status !== 'running' || typedText.length === 0) return

    const typedGraphemes = segmentGraphemes(normalizeText(typedText))
    const targetGraphemes = segmentGraphemes(normalizeText(targetText))
    const lastTypedGrapheme = typedGraphemes[typedGraphemes.length - 1]
    const correspondingTargetGrapheme = targetGraphemes[typedGraphemes.length - 1]
    
    if (lastTypedGrapheme === correspondingTargetGrapheme) {
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

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
         document.activeElement.tagName === 'TEXTAREA') &&
        document.activeElement !== inputRef.current
      ) {
        return
      }

      if (e.ctrlKey || e.altKey || e.metaKey) {
        return
      }

      if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Spacebar' && e.key !== 'Enter') {
        return
      }

      if (status === 'idle' || status === 'running') {
        inputRef.current?.focus({ preventScroll: true })
      }
    }
    
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [status])

  const handleRestart = () => {
    resetTest()
    inputRef.current?.focus({ preventScroll: true })
  }

  const handleModeChange = (newMode: TestMode) => {
    setMode(newMode)
    resetTest()
  }

  const handleLanguageChange = (newLang: 'english' | 'khmer' | 'mixed') => {
    setLanguage(newLang)
    if (mode === 'practice') {
      setPracticeIndex(0)
    }
  }

  const handlePracticeIndexChange = (index: number, newLang: 'english' | 'khmer' | 'mixed') => {
    setLanguage(newLang)
    setPracticeIndex(index)
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50)
  }

  const progress = targetText.length > 0 
    ? (segmentGraphemes(normalizeText(typedText)).length / segmentGraphemes(normalizeText(targetText)).length) * 100 
    : 0

  const isFinished = status === 'finished'

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground transition-colors duration-300 flex flex-col">
      <textarea
        ref={inputRef}
        value={typedText}
        onChange={(e) => handleTyping(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="fixed top-0 left-0 opacity-0 w-px h-px overflow-hidden pointer-events-none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-hidden="true"
        tabIndex={-1}
      />
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* FULL WIDTH HEADER */}
      <header className="shrink-0 z-50 bg-background/95 backdrop-blur border-b w-full">
        {/* INNER CONTAINER (Aligns with main body) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden">
              <img 
                src="/logo.svg" 
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
            {/* Desktop-only controls */}
            <div className="hidden sm:flex items-center gap-2">
              <SoundControls />
              <ExportControls resultsRef={resultsRef} />
            </div>

            {/* Always visible Theme Toggle */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 bg-card w-8 shrink-0"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {/* Settings button */}
            <Button 
              variant={showSettings ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 px-2 sm:px-3 lg:hidden shrink-0"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:ml-1.5">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER (Restricts width for the layout) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden w-full pt-8 pb-4 flex flex-col lg:flex-row gap-8">
          
          {/* TYPING AREA */}
          <ScrollArea className="flex-1 min-w-0 pr-4">
            <div className="pb-8">
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

              {!isFinished && (
                <div ref={resultsRef} className="space-y-6">
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

              {isFinished && stats && (
                <div ref={resultsRef}>
                  <ResultsDisplay
                    stats={stats}
                    mode={mode}
                    wpmHistory={wpmHistory}
                    onRestart={handleRestart}
                    onChangeMode={handleModeChange}
                    typedText={typedText}
                    targetText={targetText}
                  />
                </div>
              )}
            </div>
          </ScrollArea>

          {/* SETTINGS SIDEBAR */}
          <div className={cn(
            "fixed inset-y-0 right-0 z-50 w-80 bg-background border-l shadow-2xl transition-transform duration-300 ease-in-out",
            showSettings ? "translate-x-0" : "translate-x-full",
            "lg:static lg:translate-x-0 lg:z-0 lg:w-72 lg:shrink-0 lg:h-full lg:shadow-none lg:bg-transparent lg:border-none",
            "flex flex-col"
          )}>
            <div className="flex-1 overflow-hidden flex flex-col min-h-0"> 
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
      </div>

      {/* FULL WIDTH FOOTER */}
      <footer className="shrink-0 w-full border-t bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-muted-foreground/60">
          <p>SCCGroup Typing Test &copy; {new Date().getFullYear()} • Press any key to start typing • Esc to restart</p>
        </div>
      </footer>
      
      <PWAInstallPrompt />
    </div>
  )
}

export default App