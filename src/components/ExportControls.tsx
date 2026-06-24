import React from 'react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Download, FileJson, FileSpreadsheet, Share2, Camera } from 'lucide-react'
import { ExportService } from '../services/exportService'
import { getSessions } from '../services/statsService'
import { toast } from 'sonner'

interface ExportControlsProps {
  resultsRef?: React.RefObject<HTMLDivElement | null>
}

const ExportControls: React.FC<ExportControlsProps> = ({ resultsRef }) => {

  const handleExportCSV = () => {
    try {
      const sessions = getSessions()
      if (sessions.length === 0) {
        toast.error('No data to export. Complete a test first!')
        return
      }
      ExportService.exportCSV(sessions)
      toast.success('CSV exported successfully!')
    } catch (error) {
      toast.error('Failed to export CSV')
    }
  }

  const handleExportJSON = () => {
    try {
      const sessions = getSessions()
      if (sessions.length === 0) {
        toast.error('No data to export. Complete a test first!')
        return
      }
      ExportService.exportJSON(sessions)
      toast.success('JSON exported successfully!')
    } catch (error) {
      toast.error('Failed to export JSON')
    }
  }

  const handleShareResults = async () => {
    if (resultsRef?.current) {
      try {
        await ExportService.shareScreenshot(resultsRef.current)
        toast.success('Screenshot shared!')
      } catch (error) {
        toast.error('Failed to share screenshot')
      }
    } else {
      toast.info('Complete a test first to share results!')
    }
  }

  const handleScreenshot = async () => {
    if (resultsRef?.current) {
      try {
        await ExportService.shareScreenshot(resultsRef.current)
        toast.success('Screenshot saved!')
      } catch (error) {
        toast.error('Failed to save screenshot')
      }
    } else {
      toast.info('Complete a test first to take a screenshot!')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"  size="sm" className="gap-2 bg-card h-8">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareResults}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Results
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleScreenshot}>
          <Camera className="h-4 w-4 mr-2" />
          Save Screenshot
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportControls