"use client"

import { useMemo, useState, useEffect } from 'react'
import seedrandom from 'seedrandom'
import styles from './PathContainer.module.css'
import Path2 from '@/components/Path2/Path2'

// Brand colors
const BRAND_COLORS = [
  '#231f20', // black
  '#FC555B', // red
  '#FCDC4A', // yellow
  '#FB6DCB', // pink
  '#A9ECD4', // blue
  '#EAEADA', // offwhite
]

interface PathConfig {
  color: string
  lobes: 0 | 1 | 2
  amplitude: number
  strokeWidth: number
  bias: 'left' | 'right' | 'auto'
  wildness: number
  seed: number // Each path gets its own seed
}

export interface PathContainerProps {
  width: number
  height: number
  bgColor: string
  pathCount: number
  className?: string
  seed?: number // Optional seed for reproducible paths
}

export default function PathContainer({
  width,
  height,
  bgColor,
  pathCount,
  className,
  seed
}: PathContainerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const paths = useMemo(() => {
    if (!mounted) return []

    // Use provided seed or generate one
    const containerSeed = seed ?? Math.random()
    console.log('PathContainer generating paths with seed:', containerSeed)
    const rng = seedrandom(containerSeed.toString())

    // Filter out the background color from available path colors
    const availableColors = BRAND_COLORS.filter(c => c !== bgColor)

    // Shuffle using seeded random
    const shuffled = [...availableColors].sort(() => rng() - 0.5)
    const selectedColors = shuffled.slice(0, pathCount)

    // Scale stroke width based on container size
    const sizeReference = Math.sqrt(width * height)
    const smallestReference = Math.sqrt(300 * 200) // ~245
    const largestReference = Math.sqrt(1000 * 700) // ~837
    const scaleFactor = (sizeReference - smallestReference) / (largestReference - smallestReference)
    const minStroke = 30 + scaleFactor * 50 // 30-80
    const maxStroke = 50 + scaleFactor * 70 // 50-120

    // Generate random path configs using seeded random
    return selectedColors.map((color, idx) => ({
      color,
      lobes: [0, 1, 2][Math.floor(rng() * 3)] as 0 | 1 | 2,
      amplitude: 0.4 + rng() * 0.35, // 0.4-0.75
      strokeWidth: Math.floor(minStroke + rng() * (maxStroke - minStroke)),
      bias: (['left', 'right', 'auto'][Math.floor(rng() * 3)]) as 'left' | 'right' | 'auto',
      wildness: 0.8 + rng() * 0.7, // 0.8-1.5
      seed: containerSeed + idx // Unique seed per path
    }))
  }, [mounted, width, height, bgColor, pathCount, seed])

  const cx = (...args: Array<string | false | null | undefined>) => args.filter(Boolean).join(' ')

  if (!mounted) {
    return (
      <div
        className={cx(styles.container, className)}
        style={{
          backgroundColor: bgColor,
          aspectRatio: `${width} / ${height}`
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    )
  }

  return (
    <div
      className={cx(styles.container, className)}
      style={{
        backgroundColor: bgColor,
        aspectRatio: `${width} / ${height}`
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        {paths.map((pathConfig, idx) => (
          <Path2
            key={idx}
            lobes={pathConfig.lobes}
            amplitude={pathConfig.amplitude}
            color={pathConfig.color}
            strokeWidth={pathConfig.strokeWidth}
            bias={pathConfig.bias}
            wildness={pathConfig.wildness}
            seed={pathConfig.seed}
            asPathOnly={true}
            containerWidth={width}
            containerHeight={height}
          />
        ))}
      </svg>
    </div>
  )
}

