import React from 'react'

interface TargetViewProps {
  horizontalDeviation: number
  verticalDeviation: number
}

export function TargetView({ horizontalDeviation, verticalDeviation }: TargetViewProps) {
  const size = 200 // Size of the target in pixels
  const center = size / 2
  const maxDeviation = 20 // Maximum deviation in cm that we want to show within the target

  // Convert cm to pixels
  const pixelsPerCm = (size / 2) / maxDeviation
  let hitX = center + horizontalDeviation * pixelsPerCm
  let hitY = center - verticalDeviation * pixelsPerCm // Inverted because SVG Y-axis is top-down

  // Calculate the angle and distance of the hit point from the center
  const angle = Math.atan2(hitY - center, hitX - center)
  const distance = Math.sqrt(Math.pow(hitX - center, 2) + Math.pow(hitY - center, 2))

  // If the hit point is outside the target, adjust its position to the edge of the target
  if (distance > size / 2) {
    hitX = center + Math.cos(angle) * (size / 2 - 5) // 5 pixels from the edge
    hitY = center + Math.sin(angle) * (size / 2 - 5)
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="border border-gray-300 rounded-full">
      {/* Outer circle */}
      <circle cx={center} cy={center} r={size / 2 - 1} fill="white" stroke="black" strokeWidth="2" />
      
      {/* Inner circles */}
      {[0.8, 0.6, 0.4, 0.2].map((scale, index) => (
        <circle 
          key={index}
          cx={center} 
          cy={center} 
          r={size / 2 * scale} 
          fill="none" 
          stroke="black" 
          strokeWidth="1"
        />
      ))}
      
      {/* Crosshairs */}
      <line x1={0} y1={center} x2={size} y2={center} stroke="black" strokeWidth="1" />
      <line x1={center} y1={0} x2={center} y2={size} stroke="black" strokeWidth="1" />
      
      {/* Hit point */}
      <circle cx={hitX} cy={hitY} r="4" fill="red" />
    </svg>
  )
}