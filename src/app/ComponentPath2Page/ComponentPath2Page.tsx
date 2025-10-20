'use client'

import { useState, useEffect } from 'react'
import styles from './ComponentPath2Page.module.css'
import Path2 from '@/components/Path2/Path2'
import { BRAND_COLORS } from '@/components/Path2/Path2'

interface Division {
  id: string
  style: React.CSSProperties
  pathCount: number
  paths: Array<{ 
    color: string
    lobes: 0 | 1 | 2
    amplitude: number
    strokeWidth: number
    bias: 'left' | 'right' | 'auto'
    wildness: number
  }>
  isDark: boolean
}

export default function ComponentPath2Page() {
  const [divisions, setDivisions] = useState<Division[]>([])

  useEffect(() => {
    const layout = generateRandomLayout()
    const withPaths = layout.map(div => {
      const pathCount = Math.floor(1 + Math.random() * 3)
      const isDark = Math.random() < 0.3
      
      const availableColors = isDark 
        ? ['#EAEADA', '#A9ECD4', '#FCDC4A']
        : ['#FC555B', '#FCDC4A', '#FB6DCB', '#A9ECD4']
      
      const shuffled = [...availableColors].sort(() => Math.random() - 0.5)
      const selectedColors = shuffled.slice(0, pathCount)
      
      const paths = selectedColors.map(color => ({
        color,
        lobes: [0, 1, 2][Math.floor(Math.random() * 3)] as 0 | 1 | 2,
        amplitude: 0.4 + Math.random() * 0.35, // 0.4-0.75
        strokeWidth: 50 + Math.floor(Math.random() * 30), // 50-80px
        bias: (['left', 'right', 'auto'][Math.floor(Math.random() * 3)]) as 'left' | 'right' | 'auto',
        wildness: 0.8 + Math.random() * 0.7 // 0.8-1.5 varied wildness
      }))
      
      return { ...div, pathCount, paths, isDark }
    })
    setDivisions(withPaths)
  }, [])

  if (divisions.length === 0) return null

  return (
    <div className={styles.componentPath2Page}>
      {divisions.map((division) => (
        <div 
          key={division.id} 
          className={styles.division} 
          style={{
            ...division.style,
            backgroundColor: division.isDark ? '#231f20' : 'transparent'
          }}
        >
          {division.paths.map((pathConfig, idx) => (
            <Path2 
              key={idx} 
              lobes={pathConfig.lobes}
              amplitude={pathConfig.amplitude}
              color={pathConfig.color}
              strokeWidth={pathConfig.strokeWidth}
              bias={pathConfig.bias}
              wildness={pathConfig.wildness}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function generateRandomLayout(): Array<Omit<Division, 'pathCount' | 'paths' | 'isDark'>> {
  const layouts = [
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 3' } },
      { id: 'b', style: { gridColumn: '2 / 4', gridRow: '1 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 3' } },
      { id: 'b', style: { gridColumn: '2 / 4', gridRow: '1 / 2' } },
      { id: 'c', style: { gridColumn: '2 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 4', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '1 / 3', gridRow: '2 / 3' } },
      { id: 'c', style: { gridColumn: '3 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 3', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '3 / 4', gridRow: '1 / 2' } },
      { id: 'c', style: { gridColumn: '1 / 2', gridRow: '2 / 3' } },
      { id: 'd', style: { gridColumn: '2 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 3' } },
      { id: 'b', style: { gridColumn: '2 / 3', gridRow: '1 / 2' } },
      { id: 'c', style: { gridColumn: '3 / 4', gridRow: '1 / 2' } },
      { id: 'd', style: { gridColumn: '2 / 3', gridRow: '2 / 3' } },
      { id: 'e', style: { gridColumn: '3 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 3', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '3 / 4', gridRow: '1 / 3' } },
      { id: 'c', style: { gridColumn: '1 / 3', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 3' } },
      { id: 'b', style: { gridColumn: '2 / 4', gridRow: '1 / 2' } },
      { id: 'c', style: { gridColumn: '2 / 3', gridRow: '2 / 3' } },
      { id: 'd', style: { gridColumn: '3 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 4', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '1 / 2', gridRow: '2 / 3' } },
      { id: 'c', style: { gridColumn: '2 / 4', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 3', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '3 / 4', gridRow: '1 / 3' } },
      { id: 'c', style: { gridColumn: '1 / 2', gridRow: '2 / 3' } },
      { id: 'd', style: { gridColumn: '2 / 3', gridRow: '2 / 3' } },
    ],
    () => [
      { id: 'a', style: { gridColumn: '1 / 2', gridRow: '1 / 2' } },
      { id: 'b', style: { gridColumn: '2 / 4', gridRow: '1 / 3' } },
      { id: 'c', style: { gridColumn: '1 / 2', gridRow: '2 / 3' } },
    ],
  ]

  const randomLayout = layouts[Math.floor(Math.random() * layouts.length)]
  return randomLayout()
}

