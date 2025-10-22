'use client'

import { Suspense, useRef, useState } from 'react'
import styles from './BrandShaderHero.module.css'
import ShaderCanvas, { ShaderCanvasHandle } from '@/components/BrandShader/ShaderCanvas'
import { getShaderByIndex } from '@/components/BrandShader/shaders'
import { getRandomHardEdgeColors, getHardEdgeColorCount } from '@/components/BrandShader/shaders/ConfettiCelebrationShader'
import { getRandomColorSet, getColorCount } from '@/components/BrandShader/shaders/WavyLinesShader'
import PlayneLogo from '@/components/BrandShader/PlayneLogo'

// Brand colors (excluding black)
const BRAND_COLORS_NO_BLACK = [
  [0.973, 0.918, 0.875], // offwhite
  [0.992, 0.820, 0.341], // yellow
  [0.988, 0.416, 0.365], // red
  [0.549, 0.784, 0.918], // blue
  [0.271, 0.655, 0.569], // green
]

function getRandomBrandColor() {
  const color = BRAND_COLORS_NO_BLACK[Math.floor(Math.random() * BRAND_COLORS_NO_BLACK.length)]
  return `rgb(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)})`
}

export default function BrandShaderHero() {
  const canvasRef = useRef<ShaderCanvasHandle>(null)
  const [shaderIndex, setShaderIndex] = useState(0) // 0 = Hard Noise, 1 = Wavy Lines
  const [logoColor, setLogoColor] = useState('#231f20') // black
  
  // Get shaders
  const hardEdgeShader = getShaderByIndex(5) // Hard Edge Noise
  const wavyLinesShader = getShaderByIndex(1) // Wavy Lines
  
  const currentShader = shaderIndex === 0 ? hardEdgeShader : wavyLinesShader

  if (!currentShader) return null

  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLogoColor(getRandomBrandColor())
  }

  const handleShaderClick = () => {
    // Toggle shader
    const newIndex = shaderIndex === 0 ? 1 : 0
    setShaderIndex(newIndex)
    
    // Randomize colors for the new shader
    setTimeout(() => {
      const material = canvasRef.current?.getMaterial()
      if (!material) return

      if (newIndex === 0) {
        // Hard Edge Noise
        const colors = getRandomHardEdgeColors()
        if (material.uniforms.uColors && material.uniforms.uColorCount) {
          material.uniforms.uColors.value = colors
          material.uniforms.uColorCount.value = getHardEdgeColorCount(colors)
        }
      } else {
        // Wavy Lines
        const colors = getRandomColorSet()
        if (material.uniforms.uColors && material.uniforms.uColorCount) {
          material.uniforms.uColors.value = colors
          material.uniforms.uColorCount.value = getColorCount(colors)
        }
      }
    }, 0)
  }

  return (
    <div className={styles.brandShaderHero} onClick={handleShaderClick}>
      <div className={styles.shaderContainer}>
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <ShaderCanvas ref={canvasRef} shader={currentShader} />
        </Suspense>
      </div>
      
      <div className={styles.logoOverlay} onClick={handleLogoClick}>
        <PlayneLogo fillColor={logoColor} />
      </div>
    </div>
  )
}

