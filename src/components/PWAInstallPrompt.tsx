import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Download, X } from 'lucide-react'
import { subscribeToPrompt, clearInstallPrompt } from '../lib/pwaInstallManager'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const PWAInstallPrompt: React.FC = () => {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Already running as installed PWA — don't show anything
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // Subscribe to the globally captured event (fires immediately if already available)
    const unsubscribe = subscribeToPrompt((event) => {
      setPromptEvent(event)
    })

    return unsubscribe
  }, [])

  const handleInstall = async () => {
    if (!promptEvent) return
    try {
      await promptEvent.prompt()
      const { outcome } = await promptEvent.userChoice
      if (outcome === 'accepted') {
        clearInstallPrompt()
        setPromptEvent(null)
      }
    } catch (err) {
      console.error('[PWA] Install prompt failed:', err)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
  }

  // Don't render if: no deferred prompt captured, already dismissed, or standalone
  if (!promptEvent || dismissed) return null

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 ease-out">
      <div className="bg-card border border-border shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <img
              src="/icons/icon-192.png"
              alt="App icon"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">Install SCCG Typing Test</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              Add to your home screen for faster access and offline use.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleInstall}
                className="h-8 px-3 text-xs gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Install
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-8 px-3 text-xs text-muted-foreground"
              >
                Not now
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-7 w-7 shrink-0 -mt-1 -mr-1 text-muted-foreground"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt