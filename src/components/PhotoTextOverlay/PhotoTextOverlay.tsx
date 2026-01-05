'use client'

import { ReactNode } from 'react'
import styles from './PhotoTextOverlay.module.css'

interface PhotoTextOverlayProps {
  children: [ReactNode, ReactNode] // [photo, text]
  textPosition?: 'bottom-left' | 'bottom-right' | 'bottom-center'
  rotation?: number // degrees
  overlap?: string // percentage or px (desktop)
  mobileOverlap?: string // percentage or px (mobile)
  className?: string
}

export default function PhotoTextOverlay({
  children,
  textPosition = 'bottom-right',
  rotation = -2,
  overlap = '15%',
  mobileOverlap = '10%',
  className,
}: PhotoTextOverlayProps) {
  const [photo, text] = children

  const positionClass = {
    'bottom-left': styles.textLeft,
    'bottom-right': styles.textRight,
    'bottom-center': styles.textCenter,
  }[textPosition]

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.photoWrapper}>
        {photo}
      </div>
      <div 
        className={`${styles.textWrapper} ${positionClass}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          bottom: `calc(-1 * ${overlap})`,
          ['--mobile-overlap' as any]: mobileOverlap,
        }}
      >
        {text}
      </div>
    </div>
  )
}

