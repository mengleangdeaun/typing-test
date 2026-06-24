import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Download, X } from 'lucide-react'
import { Card, CardContent } from './ui/card'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Handle app installed
    const installedHandler = () => {
      setIsInstalled(true)
      setShowPrompt(false)
    }
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true)
        setShowPrompt(false)
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Installation failed:', error)
    }
  }

  if (isInstalled || !showPrompt) return null

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 shadow-lg animate-in slide-in-from-bottom-5 duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Install Typing Test</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Install for offline use and faster access
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleInstall} className="gap-2">
              <Download className="h-4 w-4" />
              Install
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrompt(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PWAInstallPrompt