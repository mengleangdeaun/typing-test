import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Volume2,
  VolumeX,
  CloudRain,
  Waves,
  Trees,
  Coffee,
  X
} from 'lucide-react'
import { soundService } from '../services/soundService'
import { cn } from '../lib/utils'

interface SoundControlsProps {
  className?: string
}

const SoundControls: React.FC<SoundControlsProps> = ({ className }) => {
  const [volume, setVolume] = useState(0.3)
  const [isMuted, setIsMuted] = useState(false)
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false)
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    soundService.setVolume(volume)
  }, [volume])

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    soundService.setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      soundService.setVolume(volume)
      setIsMuted(false)
    } else {
      soundService.setVolume(0)
      setIsMuted(true)
    }
  }

  const playAmbient = (type: 'rain' | 'waves' | 'forest' | 'cafe') => {
    soundService.stopAmbientSound()
    
    if (activeAmbient === type) {
      setActiveAmbient(null)
      setIsAmbientPlaying(false)
      return
    }

    switch (type) {
      case 'rain':
        soundService.playRain()
        break
      case 'waves':
        soundService.playWaves()
        break
      case 'forest':
        soundService.playForest()
        break
      case 'cafe':
        soundService.playCafe()
        break
    }

    setActiveAmbient(type)
    setIsAmbientPlaying(true)
  }

  const stopAmbient = () => {
    soundService.stopAmbientSound()
    setActiveAmbient(null)
    setIsAmbientPlaying(false)
  }

  const ambientOptions = [
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'waves', label: 'Waves', icon: Waves },
    { id: 'forest', label: 'Forest', icon: Trees },
    { id: 'cafe', label: 'Cafe', icon: Coffee }
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2 h-8 bg-card", className)}>
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <span className="hidden sm:inline">Sound</span>
          {isAmbientPlaying && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Volume</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="h-8 w-8 p-0"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Focus Sounds</span>
            {isAmbientPlaying && (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopAmbient}
                className="h-6 text-xs text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Stop
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ambientOptions.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeAmbient === id ? 'default' : 'outline'}
                size="sm"
                onClick={() => playAmbient(id as any)}
                className="justify-start gap-2"
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{label}</span>
                {activeAmbient === id && (
                  <span className="ml-auto relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-2">
          <p>Sound effects: Keypress, Errors, Test completion</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SoundControls