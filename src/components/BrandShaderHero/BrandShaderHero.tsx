'use client'

import { Suspense, useRef, useState } from 'react'
import styles from './BrandShaderHero.module.css'
import ShaderCanvas, { ShaderCanvasHandle } from '@/components/BrandShader/ShaderCanvas'
import { getShaderByIndex } from '@/components/BrandShader/shaders'
import { getRandomHardEdgeColors, getHardEdgeColorCount } from '@/components/BrandShader/shaders/ConfettiCelebrationShader'
import { getRandomColorSet, getColorCount } from '@/components/BrandShader/shaders/WavyLinesHardShader'

export default function BrandShaderHero() {
  const canvasRef = useRef<ShaderCanvasHandle>(null)
  const [shaderIndex, setShaderIndex] = useState(0) // 0 = Hard Noise, 1 = Wavy Lines Hard
  
  // Get shaders
  const hardEdgeShader = getShaderByIndex(5) // Hard Edge Noise
  const wavyLinesHardShader = getShaderByIndex(8) // Wavy Lines Hard (newly added at index 8)
  
  const currentShader = shaderIndex === 0 ? hardEdgeShader : wavyLinesHardShader

  if (!currentShader) return null

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
        // Wavy Lines Hard
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
    </div>
  )
}

