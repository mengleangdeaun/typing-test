import React from 'react'
import type { Quote } from '../../types'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

interface QuoteModeProps {
  quote: Quote | null
}

const QuoteMode: React.FC<QuoteModeProps> = ({ quote }) => {
  if (!quote) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No quote available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-6">
        <blockquote className="space-y-4">
          <p className="text-lg leading-relaxed font-serif italic">
            "{quote.text}"
          </p>
          <footer className="flex flex-wrap items-center gap-4 text-sm">
            <cite className="not-italic font-medium">
              — {quote.author}
            </cite>
            {quote.source && (
              <span className="text-muted-foreground">
                from {quote.source}
              </span>
            )}
            <div className="flex gap-2 ml-auto">
              <Badge variant="outline" className="text-xs">
                {quote.difficulty}
              </Badge>
              {quote.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  )
}

export default QuoteMode