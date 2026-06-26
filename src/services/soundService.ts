// Sound effects using Web Audio API
class SoundService {
  private audioContext: AudioContext | null = null
  private isInitialized = false
  private masterGain: GainNode | null = null

  constructor() {
    this.initAudio()
  }

  private initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = 0.3 // Default volume
      this.isInitialized = true
    } catch (error) {
      console.warn('Web Audio API not supported')
    }
  }

  private ensureAudio() {
    if (!this.isInitialized) {
      this.initAudio()
    }
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ) {
    this.ensureAudio()
    if (!this.audioContext || !this.masterGain) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = type
      oscillator.frequency.value = frequency

      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (error) {
      console.warn('Failed to play sound:', error)
    }
  }

  // Sound effects
  playKeyPress() {
    this.playTone(800, 0.03, 'sine', 0.15)
  }

  playKeyError() {
    this.playTone(300, 0.15, 'sawtooth', 0.25)
  }

  playKeyCorrect() {
    this.playTone(1000, 0.04, 'sine', 0.12)
  }

  playTestComplete() {
    // Play a pleasant chord
    setTimeout(() => this.playTone(523, 0.2, 'sine', 0.3), 0)
    setTimeout(() => this.playTone(659, 0.2, 'sine', 0.25), 100)
    setTimeout(() => this.playTone(784, 0.3, 'sine', 0.2), 200)
  }

  playWordComplete() {
    this.playTone(1200, 0.06, 'sine', 0.15)
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  toggleMute() {
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterGain.gain.value > 0 ? 0 : 0.3
    }
  }

  isMuted() {
    return this.masterGain?.gain.value === 0
  }
}

export const soundService = new SoundService()