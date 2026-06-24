import type { Session } from '../types'

export class ExportService {
  // Export to CSV
  static toCSV(sessions: Session[]): string {
    if (sessions.length === 0) return ''

    const headers = [
      'Date',
      'Mode',
      'WPM',
      'Accuracy',
      'Raw WPM',
      'Net WPM',
      'Consistency',
      'Duration (s)',
      'Characters Typed',
      'Correct Chars',
      'Incorrect Chars',
      'Difficulty'
    ]

    const rows = sessions.map(session => [
      new Date(session.date).toLocaleString(),
      session.mode,
      session.wpm,
      session.accuracy,
      session.rawWpm,
      session.stats.netWpm,
      session.consistency,
      session.duration,
      session.stats.charactersTyped,
      session.stats.correctChars,
      session.stats.incorrectChars,
      session.difficulty
    ])

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
  }

  // Export to JSON
  static toJSON(sessions: Session[]): string {
    return JSON.stringify(sessions, null, 2)
  }

  // Download file
  static download(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Export current session as CSV
  static exportCSV(sessions: Session[]) {
    const csv = this.toCSV(sessions)
    this.download(csv, `typing-history-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  // Export current session as JSON
  static exportJSON(sessions: Session[]) {
    const json = this.toJSON(sessions)
    this.download(json, `typing-history-${new Date().toISOString().split('T')[0]}.json`, 'application/json')
  }

  // Share screenshot (using modern screenshot API)
  static async shareScreenshot(element: HTMLElement): Promise<void> {
    try {
      // Use html2canvas for full screenshot support
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true
      })

      // Try native sharing first
      if (navigator.share) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `typing-test-${Date.now()}.png`, { type: 'image/png' })
            try {
              await navigator.share({
                title: 'My Typing Test Results',
                text: 'Check out my typing speed results!',
                files: [file]
              })
            } catch (shareError) {
              // User cancelled or share failed
              console.log('Share cancelled or failed')
            }
          }
        })
      } else {
        // Fallback: download the image
        const link = document.createElement('a')
        link.download = `typing-test-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    } catch (error) {
      console.error('Failed to create screenshot:', error)
      // Fallback: try to share the page URL
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Typing Test Results',
            text: `I achieved ${this.getLatestWPM()} WPM on the typing test!`,
            url: window.location.href
          })
        } catch (shareError) {
          console.log('Share cancelled or failed')
        }
      }
    }
  }

  private static getLatestWPM(): number {
    const sessions = JSON.parse(localStorage.getItem('typing_sessions') || '[]')
    if (sessions.length === 0) return 0
    return sessions[sessions.length - 1].wpm || 0
  }
}