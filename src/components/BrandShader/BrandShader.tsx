'use client'

import { Suspense, useRef, useState } from 'react'
import styles from './BrandShader.module.css'
import ShaderCanvas, { ShaderCanvasHandle } from './ShaderCanvas'
import { useKeyboardControls } from './hooks/useKeyboardControls'
import { shaderRegistry, getShaderByIndex } from './shaders'
import { getRandomColorPair } from './shaders/PerlinNoiseShader'
import { getRandomColorSet, getColorCount } from './shaders/WavyLinesShader'
import { getRandomBlobColors, getBlobColorCount } from './shaders/BubblegumBlobsShader'
import { getRandomRippleColors, getRippleColorCount } from './shaders/RainbowRipplesShader'
import { getRandomKaleidoscopeColors, getKaleidoscopeColorCount } from './shaders/KaleidoscopeDreamsShader'
import { getRandomConfettiColors, getConfettiColorCount } from './shaders/ConfettiCelebrationShader'
import { getRandomCosmicColors, getCosmicColorCount } from './shaders/CosmicSpiralsShader'
import { getRandomSeascapeColors } from './shaders/SeascapeShader'
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
    } else if (shaderIndex === 2) {
      // Bubblegum Blobs: 3-5 colors
      const colors = getRandomBlobColors()
      if (material.uniforms.uColors && material.uniforms.uColorCount) {
        material.uniforms.uColors.value = colors
        material.uniforms.uColorCount.value = getBlobColorCount(colors)
      }
    } else if (shaderIndex === 3) {
      // Rainbow Ripples: 3-5 colors
      const colors = getRandomRippleColors()
      if (material.uniforms.uColors && material.uniforms.uColorCount) {
        material.uniforms.uColors.value = colors
        material.uniforms.uColorCount.value = getRippleColorCount(colors)
      }
    } else if (shaderIndex === 4) {
      // Kaleidoscope Dreams: 3-5 colors
      const colors = getRandomKaleidoscopeColors()
      if (material.uniforms.uColors && material.uniforms.uColorCount) {
        material.uniforms.uColors.value = colors
        material.uniforms.uColorCount.value = getKaleidoscopeColorCount(colors)
      }
    } else if (shaderIndex === 5) {
      // Confetti Celebration: 4-5 colors
      const colors = getRandomConfettiColors()
      if (material.uniforms.uColors && material.uniforms.uColorCount) {
        material.uniforms.uColors.value = colors
        material.uniforms.uColorCount.value = getConfettiColorCount(colors)
      }
    } else if (shaderIndex === 6) {
      // Cosmic Spirals: 3-4 colors
      const colors = getRandomCosmicColors()
      if (material.uniforms.uColors && material.uniforms.uColorCount) {
        material.uniforms.uColors.value = colors
        material.uniforms.uColorCount.value = getCosmicColorCount(colors)
      }
    } else if (shaderIndex === 7) {
      // Seascape: water and sky colors
      const colors = getRandomSeascapeColors()
      if (material.uniforms.uWaterColor && material.uniforms.uSkyColor) {
        material.uniforms.uWaterColor.value = [colors[0], colors[1], colors[2]]
        material.uniforms.uSkyColor.value = [colors[3], colors[4], colors[5]]
      }
    }
  }

  const handleClick = () => {
    if (displayMode === 'fullscreen') {
      // In fullscreen, clicking background randomizes shader colors
      handleBackgroundClick()
    } else {
      // In non-fullscreen, clicking randomizes shader colors for all shaders
      const material = canvasRef.current?.getMaterial()
      if (!material) return

      if (shaderIndex === 0) {
        if (material.uniforms.uColor1 && material.uniforms.uColor2) {
          const [color1, color2] = getRandomColorPair()
          material.uniforms.uColor1.value = color1
          material.uniforms.uColor2.value = color2
        }
      } else if (shaderIndex === 1) {
        const colors = getRandomColorSet()
        if (material.uniforms.uColors && material.uniforms.uColorCount) {
          material.uniforms.uColors.value = colors
          material.uniforms.uColorCount.value = getColorCount(colors)
        }
      } else if (shaderIndex === 2) {
        const colors = getRandomBlobColors()
        if (material.uniforms.uColors && material.uniforms.uColorCount) {
          material.uniforms.uColors.value = colors
          material.uniforms.uColorCount.value = getBlobColorCount(colors)
        }
      } else if (shaderIndex === 3) {
        const colors = getRandomRippleColors()
        if (material.uniforms.uColors && material.uniforms.uColorCount) {
          material.uniforms.uColors.value = colors
          material.uniforms.uColorCount.value = getRippleColorCount(colors)
        }
      } else if (shaderIndex === 4) {
        const colors = getRandomKaleidoscopeColors()
        if (material.uniforms.uColors && material.uniforms.uColorCount) {
          material.uniforms.uColors.value = colors
          material.uniforms.uColorCount.value = getKaleidoscopeColorCount(colors)
        }
      } else if (shaderIndex === 5) {
        const colors = getRandomConfettiColors()
        if (material.uniforms.uColors && material.uniforms.uColorCount) {
          material.uniforms.uColors.value = colors
          material.uniforms.uColorCount.value = getConfettiColorCount(colors)
        }
      } else if (shaderIndex === 6) {
        const colors = getRandomCosmicColors()
        if (material.uniforms.uColors && material.uniforms.uColorCount) {
          material.uniforms.uColors.value = colors
          material.uniforms.uColorCount.value = getCosmicColorCount(colors)
        }
      } else if (shaderIndex === 7) {
        const colors = getRandomSeascapeColors()
        if (material.uniforms.uWaterColor && material.uniforms.uSkyColor) {
          material.uniforms.uWaterColor.value = [colors[0], colors[1], colors[2]]
          material.uniforms.uSkyColor.value = [colors[3], colors[4], colors[5]]
        }
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
          {displayMode !== 'fullscreen' && ' • Click to randomize colors'}
        </div>
      </div>
    </div>
  )
}


