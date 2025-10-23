'use client'

import { Suspense, useRef } from 'react'
import styles from './BrandShaderHero.module.css'
import ShaderCanvas, { ShaderCanvasHandle } from '@/components/BrandShader/ShaderCanvas'
import { getShaderByIndex } from '@/components/BrandShader/shaders'
import { getRandomColorSet, getColorCount } from '@/components/BrandShader/shaders/WavyLinesHardShader'

export default function BrandShaderHero() {
  const canvasRef = useRef<ShaderCanvasHandle>(null)
  
  // Get wavy lines hard shader
  const wavyLinesHardShader = getShaderByIndex(8) // Wavy Lines Hard

  if (!wavyLinesHardShader) return null

  const handleShaderClick = () => {
    // Randomize colors only
    const material = canvasRef.current?.getMaterial()
    if (!material) return

    const colors = getRandomColorSet()
    if (material.uniforms.uColors && material.uniforms.uColorCount) {
      material.uniforms.uColors.value = colors
      material.uniforms.uColorCount.value = getColorCount(colors)
    }
  }

  return (
    <div className={styles.brandShaderHero} onClick={handleShaderClick}>
      <div className={styles.shaderContainer}>
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <ShaderCanvas ref={canvasRef} shader={wavyLinesHardShader} />
        </Suspense>
      </div>
    </div>
  )
}

