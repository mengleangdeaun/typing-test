/**
 * PWA Install Manager
 *
 * Captures `beforeinstallprompt` at module load time (before React mounts)
 * so the event is never missed regardless of when components register listeners.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type PromptListener = (event: BeforeInstallPromptEvent | null) => void

let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners: Set<PromptListener> = new Set()

function notify() {
  listeners.forEach((fn) => fn(deferredPrompt))
}

// Capture the event as early as the module is imported
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    notify()
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    notify()
  })
}

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt
}

export function clearInstallPrompt(): void {
  deferredPrompt = null
  notify()
}

export function subscribeToPrompt(fn: PromptListener): () => void {
  listeners.add(fn)
  // Immediately call with current value so late subscribers get it
  fn(deferredPrompt)
  return () => listeners.delete(fn)
}
