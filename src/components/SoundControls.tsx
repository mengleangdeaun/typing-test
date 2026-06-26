import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Volume2, VolumeX } from 'lucide-react'
import { soundService } from '../services/soundService'
import { cn } from '../lib/utils'

interface SoundControlsProps {
  className?: string
}

const SoundControls: React.FC<SoundControlsProps> = ({ className }) => {
  const [volume, setVolume] = useState(0.3)
  const [isMuted, setIsMuted] = useState(false)
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2 h-8 bg-card", className)}>
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <span className="hidden sm:inline">Sound</span>
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

        <div className="text-xs text-muted-foreground border-t pt-2">
          <p>Sound effects: Keypress, Errors, Test completion</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SoundControls