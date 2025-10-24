'use client'

import { Suspense, useRef } from 'react'
import styles from './BrandShaderHero.module.css'
import ShaderCanvas, { ShaderCanvasHandle } from '@/components/BrandShader/ShaderCanvas'
import { getShaderByIndex } from '@/components/BrandShader/shaders'

export default function BrandShaderHero() {
  const canvasRef = useRef<ShaderCanvasHandle>(null)
  
  // Get wavy lines hard slow shader (index 9 - last in registry)
  const wavyLinesHardSlowShader = getShaderByIndex(9)

  if (!wavyLinesHardSlowShader) return null

  return (
    <div className={styles.brandShaderHero}>
      <div className={styles.shaderContainer}>
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <ShaderCanvas ref={canvasRef} shader={wavyLinesHardSlowShader} />
        </Suspense>
      </div>
    </div>
  )
}

