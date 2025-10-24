'use client'

import { Suspense, useRef, useCallback, useEffect, useState } from 'react'
import styles from '@/components/BrandShaderHero/BrandShaderHero.module.css'
import ShaderCanvas, { ShaderCanvasHandle } from '@/components/BrandShader/ShaderCanvas'
import { getShaderByIndex } from '@/components/BrandShader/shaders'
import { getColorByIndex } from '@/components/BrandShader/shaders/WavyLinesHardSlowShader'
import ShaderControls, { ShaderParams } from '@/components/ShaderControls/ShaderControls'

const SHADER_DEFAULTS: Partial<ShaderParams> = {
  cycleSpeed: 0.5,
  pulseStart: 0.3681833970128517,
  pulseEnd: 1,
  centerX: 0.5,
  centerY: 0.5,
  radiusFalloff: 2,
  waveFrequency1: 30,
  waveFrequency2: 1,
  waveSpeed1: 0.01,
  waveSpeed2: 0.01,
  noiseStrength: 1,
  colorIntensity: 1.1098298020145885,
  colorSaturation: 2,
  colorIndex: 2, // Starting color (will auto-cycle through all)
  seed: 0.8038902396665509,
  timeScale: 0.611879124696075
}

export default function BrandShaderHeroWithControls() {
  const canvasRef = useRef<ShaderCanvasHandle>(null)
  const [currentColorIndex, setCurrentColorIndex] = useState(SHADER_DEFAULTS.colorIndex || 2)
  const lastPulseStateRef = useRef(false) // Track if we were in pulse last frame
  
  // Get wavy lines hard slow shader (index 9)
  const wavyLinesHardSlowShader = getShaderByIndex(9)

  const handleParamsChange = useCallback((params: ShaderParams) => {
    const material = canvasRef.current?.getMaterial()
    if (!material) return

    // Update all shader uniforms
    if (material.uniforms.uSeed) material.uniforms.uSeed.value = params.seed
    
    // Timing
    if (material.uniforms.uCycleSpeed) material.uniforms.uCycleSpeed.value = params.cycleSpeed
    if (material.uniforms.uPulseStart) material.uniforms.uPulseStart.value = params.pulseStart
    if (material.uniforms.uPulseEnd) material.uniforms.uPulseEnd.value = params.pulseEnd
    if (material.uniforms.uTimeScale) material.uniforms.uTimeScale.value = params.timeScale
    
    // Spatial
    if (material.uniforms.uCenterX) material.uniforms.uCenterX.value = params.centerX
    if (material.uniforms.uCenterY) material.uniforms.uCenterY.value = params.centerY
    if (material.uniforms.uRadiusFalloff) material.uniforms.uRadiusFalloff.value = params.radiusFalloff
    
    // Waves/Noise
    if (material.uniforms.uWaveFreq1) material.uniforms.uWaveFreq1.value = params.waveFrequency1
    if (material.uniforms.uWaveFreq2) material.uniforms.uWaveFreq2.value = params.waveFrequency2
    if (material.uniforms.uWaveSpeed1) material.uniforms.uWaveSpeed1.value = params.waveSpeed1
    if (material.uniforms.uWaveSpeed2) material.uniforms.uWaveSpeed2.value = params.waveSpeed2
    if (material.uniforms.uNoiseStrength) material.uniforms.uNoiseStrength.value = params.noiseStrength
    
    // Color
    if (material.uniforms.uColorIntensity) material.uniforms.uColorIntensity.value = params.colorIntensity
    if (material.uniforms.uColorSaturation) material.uniforms.uColorSaturation.value = params.colorSaturation
    if (material.uniforms.uAccentColor) {
      const color = getColorByIndex(params.colorIndex)
      material.uniforms.uAccentColor.value = color
    }
  }, [])

  // Apply defaults on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const material = canvasRef.current?.getMaterial()
      if (!material) return

      // Apply all defaults
      if (SHADER_DEFAULTS.seed !== undefined && material.uniforms.uSeed) 
        material.uniforms.uSeed.value = SHADER_DEFAULTS.seed
      
      if (SHADER_DEFAULTS.cycleSpeed !== undefined && material.uniforms.uCycleSpeed) 
        material.uniforms.uCycleSpeed.value = SHADER_DEFAULTS.cycleSpeed
      if (SHADER_DEFAULTS.pulseStart !== undefined && material.uniforms.uPulseStart) 
        material.uniforms.uPulseStart.value = SHADER_DEFAULTS.pulseStart
      if (SHADER_DEFAULTS.pulseEnd !== undefined && material.uniforms.uPulseEnd) 
        material.uniforms.uPulseEnd.value = SHADER_DEFAULTS.pulseEnd
      if (SHADER_DEFAULTS.timeScale !== undefined && material.uniforms.uTimeScale) 
        material.uniforms.uTimeScale.value = SHADER_DEFAULTS.timeScale
      
      if (SHADER_DEFAULTS.centerX !== undefined && material.uniforms.uCenterX) 
        material.uniforms.uCenterX.value = SHADER_DEFAULTS.centerX
      if (SHADER_DEFAULTS.centerY !== undefined && material.uniforms.uCenterY) 
        material.uniforms.uCenterY.value = SHADER_DEFAULTS.centerY
      if (SHADER_DEFAULTS.radiusFalloff !== undefined && material.uniforms.uRadiusFalloff) 
        material.uniforms.uRadiusFalloff.value = SHADER_DEFAULTS.radiusFalloff
      
      if (SHADER_DEFAULTS.waveFrequency1 !== undefined && material.uniforms.uWaveFreq1) 
        material.uniforms.uWaveFreq1.value = SHADER_DEFAULTS.waveFrequency1
      if (SHADER_DEFAULTS.waveFrequency2 !== undefined && material.uniforms.uWaveFreq2) 
        material.uniforms.uWaveFreq2.value = SHADER_DEFAULTS.waveFrequency2
      if (SHADER_DEFAULTS.waveSpeed1 !== undefined && material.uniforms.uWaveSpeed1) 
        material.uniforms.uWaveSpeed1.value = SHADER_DEFAULTS.waveSpeed1
      if (SHADER_DEFAULTS.waveSpeed2 !== undefined && material.uniforms.uWaveSpeed2) 
        material.uniforms.uWaveSpeed2.value = SHADER_DEFAULTS.waveSpeed2
      if (SHADER_DEFAULTS.noiseStrength !== undefined && material.uniforms.uNoiseStrength) 
        material.uniforms.uNoiseStrength.value = SHADER_DEFAULTS.noiseStrength
      
      if (SHADER_DEFAULTS.colorIntensity !== undefined && material.uniforms.uColorIntensity) 
        material.uniforms.uColorIntensity.value = SHADER_DEFAULTS.colorIntensity
      if (SHADER_DEFAULTS.colorSaturation !== undefined && material.uniforms.uColorSaturation) 
        material.uniforms.uColorSaturation.value = SHADER_DEFAULTS.colorSaturation
      if (SHADER_DEFAULTS.colorIndex !== undefined && material.uniforms.uAccentColor) {
        const color = getColorByIndex(SHADER_DEFAULTS.colorIndex)
        material.uniforms.uAccentColor.value = color
      }
    }, 100) // Small delay to ensure material is ready

    return () => clearTimeout(timer)
  }, [])

  // Auto-cycle colors: detect when we return to black and switch to a new color
  useEffect(() => {
    const checkPulseState = () => {
      const material = canvasRef.current?.getMaterial()
      if (!material) return

      // Calculate the current pulse state (using sawtooth logic now)
      const uTime = material.uniforms.uTime?.value || 0
      const uTimeScale = material.uniforms.uTimeScale?.value || 1.0
      const uCycleSpeed = material.uniforms.uCycleSpeed?.value || 0.1
      const uPulseStart = material.uniforms.uPulseStart?.value || 0.3
      const uPulseEnd = material.uniforms.uPulseEnd?.value || 0.7
      const uSeed = material.uniforms.uSeed?.value || 0
      
      const seedOffset = uSeed * 100.0
      const scaledTime = uTime * uTimeScale
      const rawCycle = scaledTime * uCycleSpeed + seedOffset
      const pulseRaw = rawCycle - Math.floor(rawCycle) // fract() equivalent in JS
      
      const isInPulse = pulseRaw > uPulseStart && pulseRaw < uPulseEnd
      
      // If we just exited the pulse (returned to black), pick a new color
      if (lastPulseStateRef.current && !isInPulse) {
        // Pick a random color different from the current one
        let newColorIndex = Math.floor(Math.random() * 4)
        // Ensure it's different from current (optional - remove if you want repeats)
        while (newColorIndex === currentColorIndex && Math.random() > 0.25) {
          newColorIndex = Math.floor(Math.random() * 4)
        }
        
        setCurrentColorIndex(newColorIndex)
        
        // Update the shader uniform
        const color = getColorByIndex(newColorIndex)
        if (material.uniforms.uAccentColor) {
          material.uniforms.uAccentColor.value = color
        }
      }
      
      lastPulseStateRef.current = isInPulse
    }

    // Check pulse state every frame
    const intervalId = setInterval(checkPulseState, 16) // ~60fps
    
    return () => clearInterval(intervalId)
  }, [currentColorIndex])

  if (!wavyLinesHardSlowShader) return null

  return (
    <>
      <div className={styles.brandShaderHero}>
        <div className={styles.shaderContainer}>
          <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <ShaderCanvas ref={canvasRef} shader={wavyLinesHardSlowShader} />
          </Suspense>
        </div>
      </div>
      {/* DAT.gui controls - commented out but ready to re-enable */}
      {/* <ShaderControls onParamsChange={handleParamsChange} initialParams={SHADER_DEFAULTS} /> */}
    </>
  )
}

