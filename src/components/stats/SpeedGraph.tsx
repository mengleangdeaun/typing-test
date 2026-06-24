import React, { useState } from 'react'

interface SpeedGraphProps {
  data: Array<{ time: number; wpm: number }>
  height?: number
}

const SpeedGraph: React.FC<SpeedGraphProps> = ({ data, height = 140 }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; wpm: number; x: number; y: number } | null>(null)

  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-muted-foreground text-xs border border-dashed border-muted/30 rounded-none" 
        style={{ height: `${height}px` }}
      >
        Start typing to see your speed graph
      </div>
    )
  }

  // Map to simple points
  const points = data.map((d, i) => ({
    index: i + 1,
    wpm: Math.round(d.wpm)
  }))

  const maxWpm = Math.max(...points.map(p => p.wpm), 20)
  const minWpm = Math.min(...points.map(p => p.wpm), 0)
  const avgWpm = Math.round(points.reduce((sum, p) => sum + p.wpm, 0) / points.length)

  // Chart dimensions inside SVG viewbox
  const paddingLeft = 35
  const paddingRight = 15
  const paddingTop = 20
  const paddingBottom = 20
  const chartWidth = 600
  const chartHeight = height

  // Scale functions
  const getX = (index: number) => {
    if (points.length <= 1) return paddingLeft + (chartWidth - paddingLeft - paddingRight) / 2
    return paddingLeft + ((index - 1) / (points.length - 1)) * (chartWidth - paddingLeft - paddingRight)
  }

  const getY = (wpm: number) => {
    const range = maxWpm - minWpm || 1
    return chartHeight - paddingBottom - ((wpm - minWpm) / range) * (chartHeight - paddingTop - paddingBottom)
  }

  // Build the path definitions
  let pathD = ''
  let areaD = ''
  if (points.length > 0) {
    const startX = getX(points[0].index)
    const startY = getY(points[0].wpm)
    pathD = `M ${startX} ${startY}`
    areaD = `M ${startX} ${getY(minWpm)} L ${startX} ${startY}`
    
    for (let i = 1; i < points.length; i++) {
      const x = getX(points[i].index)
      const y = getY(points[i].wpm)
      pathD += ` L ${x} ${y}`
      areaD += ` L ${x} ${y}`
    }
    const endX = getX(points[points.length - 1].index)
    areaD += ` L ${endX} ${getY(minWpm)} Z`
  }

  // Grid lines
  const gridCount = 4
  const gridLines = Array.from({ length: gridCount }).map((_, i) => {
    const wpmVal = minWpm + (i * (maxWpm - minWpm)) / (gridCount - 1)
    return {
      wpm: Math.round(wpmVal),
      y: getY(wpmVal)
    }
  })

  return (
    <div className="space-y-3 relative">
      <div className="flex items-center justify-between text-xs text-muted-foreground pb-1.5 border-b border-muted/10">
        <span className="font-semibold text-foreground">Speed Progress</span>
        <div className="flex gap-4">
          <span>Avg: <strong className="text-foreground">{avgWpm} WPM</strong></span>
          <span>Peak: <strong className="text-foreground">{maxWpm} WPM</strong></span>
        </div>
      </div>
      
      <div className="relative pt-1 select-none">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full overflow-visible"
          style={{ height: `${chartHeight}px` }}
        >
          {/* Gradient definition for filled path */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Labels */}
          {gridLines.map((line, i) => (
            <g key={i} className="opacity-40">
              <line 
                x1={paddingLeft} 
                y1={line.y} 
                x2={chartWidth - paddingRight} 
                y2={line.y} 
                stroke="currentColor" 
                strokeWidth={0.5} 
                className="text-muted-foreground/30"
                strokeDasharray="2 2"
              />
              <text 
                x={paddingLeft - 8} 
                y={line.y + 3} 
                textAnchor="end" 
                fontSize={9} 
                fill="currentColor"
                className="text-muted-foreground/80 font-mono"
              >
                {line.wpm}
              </text>
            </g>
          ))}

          {/* Average WPM Reference Line */}
          {points.length > 0 && (
            <g className="opacity-60">
              <line 
                x1={paddingLeft} 
                y1={getY(avgWpm)} 
                x2={chartWidth - paddingRight} 
                y2={getY(avgWpm)} 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={0.75} 
                strokeDasharray="4 3"
              />
              <text 
                x={chartWidth - paddingRight - 6} 
                y={getY(avgWpm) - 4} 
                textAnchor="end" 
                fontSize={8} 
                fill="currentColor"
                className="text-muted-foreground font-mono"
              >
                Avg {avgWpm}
              </text>
            </g>
          )}

          {/* Filled Area */}
          {points.length > 1 && (
            <path d={areaD} fill="url(#chartGradient)" />
          )}

          {/* Line Path */}
          {points.length > 1 && (
            <path 
              d={pathD} 
              fill="none" 
              stroke="hsl(var(--primary))" 
              strokeWidth={1.5} 
            />
          )}

          {/* Circles & Hover targets */}
          {points.map((p, i) => {
            const x = getX(p.index)
            const y = getY(p.wpm)
            const hoverWidth = points.length > 1 ? (chartWidth - paddingLeft - paddingRight) / (points.length - 1) : 40
            
            return (
              <g key={i}>
                {/* Active hover dot */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={hoveredPoint?.index === p.index ? 3.5 : 1.5} 
                  className="fill-primary"
                  opacity={hoveredPoint?.index === p.index ? 1.0 : 0.6}
                />
                
                {/* Invisible hover slice for touch/mouse */}
                <rect
                  x={x - hoverWidth / 2}
                  y={paddingTop}
                  width={hoverWidth}
                  height={chartHeight - paddingTop - paddingBottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint({ index: p.index, wpm: p.wpm, x, y })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            )
          })}
        </svg>

        {/* Custom Tooltip - Rounded None */}
        {hoveredPoint && (
          <div 
            className="absolute bg-popover border border-border px-2 py-1 shadow-sm text-popover-foreground text-[10px] pointer-events-none transition-all duration-75 rounded-none font-mono"
            style={{
              left: `${(hoveredPoint.x / chartWidth) * 100}%`,
              top: `${hoveredPoint.y - 36}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-bold">{hoveredPoint.wpm} WPM</div>
            <div className="text-[8px] text-muted-foreground">Sample #{hoveredPoint.index}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpeedGraph