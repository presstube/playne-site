'use client'

import { Suspense, useRef, useState } from 'react'
import styles from './BrandShader.module.css'
import ShaderCanvas, { ShaderCanvasHandle } from './ShaderCanvas'
import { useKeyboardControls } from './hooks/useKeyboardControls'
import { shaderRegistry, getShaderByIndex } from './shaders'
import { getRandomColorPair } from './shaders/PerlinNoiseShader'
import { getRandomColorSet, getColorCount } from './shaders/WavyLinesShader'
import PlayneLogo from './PlayneLogo'

// Brand colors in hex format (excluding black)
const brandColorsHex = [
  '#FC555B',  // brandRed
  '#FCDC4A',  // brandYellow
  '#FB6DCB',  // brandPink
  '#A9ECD4',  // brandBlue
  '#EAEADA',  // brandOffwhite
  '#231f20',  // brandBlack
]

function getRandomBrandColor(): string {
  const randomIndex = Math.floor(Math.random() * brandColorsHex.length)
  return brandColorsHex[randomIndex]
}

export default function BrandShader() {
  const { shaderIndex, displayMode } = useKeyboardControls(shaderRegistry.length)
  const currentShader = getShaderByIndex(shaderIndex)
  const canvasRef = useRef<ShaderCanvasHandle>(null)
  const [logoColor, setLogoColor] = useState('#231f20') // Default black

  if (!currentShader) return null

  const modeLabel = displayMode === 'masked' ? 'Masked' : displayMode === 'fullscreen' ? 'Fullscreen' : 'Background'

  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent background click handler
    setLogoColor(getRandomBrandColor())
  }

  const handleBackgroundClick = () => {
    // Randomize shader colors
    const material = canvasRef.current?.getMaterial()
    if (!material) return

    if (shaderIndex === 0) {
      // Perlin noise: 2 colors
      if (material.uniforms.uColor1 && material.uniforms.uColor2) {
        const [color1, color2] = getRandomColorPair()
        material.uniforms.uColor1.value = color1
        material.uniforms.uColor2.value = color2
      }
    } else if (shaderIndex === 1) {
      // Wavy lines: 2-5 colors
      const colors = getRandomColorSet()
      if (material.uniforms.uColors && material.uniforms.uColorCount) {
        material.uniforms.uColors.value = colors
        material.uniforms.uColorCount.value = getColorCount(colors)
      }
    }
  }

  const handleClick = () => {
    if (displayMode === 'fullscreen') {
      // In fullscreen, clicking background randomizes shader colors
      handleBackgroundClick()
    } else if (shaderIndex === 0) {
      // In non-fullscreen Perlin mode, randomize shader colors
      const material = canvasRef.current?.getMaterial()
      if (material && material.uniforms.uColor1 && material.uniforms.uColor2) {
        const [color1, color2] = getRandomColorPair()
        material.uniforms.uColor1.value = color1
        material.uniforms.uColor2.value = color2
      }
    } else if (shaderIndex === 1) {
      // In non-fullscreen wavy lines, randomize colors
      const material = canvasRef.current?.getMaterial()
      if (material && material.uniforms.uColors && material.uniforms.uColorCount) {
        const colors = getRandomColorSet()
        material.uniforms.uColors.value = colors
        material.uniforms.uColorCount.value = getColorCount(colors)
      }
    }
  }

  return (
    <div 
      className={`${styles.brandShader} ${styles[displayMode]}`}
      onClick={handleClick}
    >
      <div 
        className={`${styles.shaderContainer} ${displayMode === 'fullscreen' ? styles.fullscreen : ''}`}
      >
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <ShaderCanvas ref={canvasRef} shader={currentShader} />
        </Suspense>
      </div>
      
      {displayMode === 'fullscreen' && (
        <div className={styles.logoOverlay} onClick={handleLogoClick}>
          <PlayneLogo fillColor={logoColor} />
        </div>
      )}
      
      <div className={styles.controls}>
        <div className={styles.shaderInfo}>
          {currentShader.name} ({shaderIndex + 1}/{shaderRegistry.length}) • {modeLabel}
        </div>
        <div className={styles.instructions}>
          Press 1-{shaderRegistry.length} to switch shaders • Space to cycle modes
          {displayMode === 'fullscreen' && ' • Click logo to recolor • Click elsewhere for new shader colors'}
          {displayMode !== 'fullscreen' && (shaderIndex === 0 || shaderIndex === 1) && ' • Click to randomize colors'}
        </div>
      </div>
    </div>
  )
}


