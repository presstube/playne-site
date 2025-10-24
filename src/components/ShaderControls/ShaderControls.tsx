'use client'

import { useEffect, useRef } from 'react'

interface ShaderControlsProps {
  onParamsChange?: (params: ShaderParams) => void
  initialParams?: Partial<ShaderParams>
}

export interface ShaderParams {
  // Timing
  cycleSpeed: number
  pulseStart: number
  pulseEnd: number
  
  // Spatial
  centerX: number
  centerY: number
  radiusFalloff: number
  
  // Waves/Noise
  waveFrequency1: number
  waveFrequency2: number
  waveSpeed1: number
  waveSpeed2: number
  noiseStrength: number
  
  // Color
  colorIntensity: number
  colorSaturation: number
  colorIndex: number // 0=red, 1=yellow, 2=pink, 3=blue
  
  // General
  seed: number
  timeScale: number
}

const defaultParams: ShaderParams = {
  // Timing
  cycleSpeed: 0.1,
  pulseStart: 0.3,
  pulseEnd: 0.7,
  
  // Spatial
  centerX: 0.5,
  centerY: 0.5,
  radiusFalloff: 0.8,
  
  // Waves/Noise
  waveFrequency1: 10.0,
  waveFrequency2: 15.0,
  waveSpeed1: 0.15,
  waveSpeed2: 0.12,
  noiseStrength: 0.5,
  
  // Color
  colorIntensity: 1.0,
  colorSaturation: 1.0,
  colorIndex: 1, // yellow
  
  // General
  seed: Math.random(),
  timeScale: 1.0
}

export default function ShaderControls({ onParamsChange, initialParams }: ShaderControlsProps) {
  const guiRef = useRef<any>(null)
  const paramsRef = useRef<ShaderParams>({ ...defaultParams, ...initialParams })
  const mountedRef = useRef(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || mountedRef.current) return
    mountedRef.current = true

    // Dynamic import of dat.gui to avoid SSR issues
    import('dat.gui').then((module) => {
      // dat.gui exports as { GUI } not as default
      const GUI = module.GUI || module.default?.GUI || module.default
      
      if (!GUI) {
        console.error('Failed to load dat.GUI')
        return
      }
      
      // Create GUI
      const gui = new GUI({ width: 300 })
      gui.domElement.style.position = 'fixed'
      gui.domElement.style.top = '10px'
      gui.domElement.style.right = '10px'
      gui.domElement.style.zIndex = '10000'
      guiRef.current = gui

      const params = paramsRef.current

      // Timing folder
      const timingFolder = gui.addFolder('Timing')
      timingFolder.add(params, 'cycleSpeed', 0.01, 0.5).onChange(notify).name('Cycle Speed').listen()
      timingFolder.add(params, 'pulseStart', 0, 1).onChange(notify).name('Pulse Start (0-1)').listen()
      timingFolder.add(params, 'pulseEnd', 0, 1).onChange(notify).name('Pulse End (0-1)').listen()
      timingFolder.add(params, 'timeScale', 0, 2).onChange(notify).name('Time Scale').listen()
      timingFolder.open()

      // Spatial folder
      const spatialFolder = gui.addFolder('Spatial')
      spatialFolder.add(params, 'centerX', 0, 1).onChange(notify).name('Center X (0=left, 1=right)').listen()
      spatialFolder.add(params, 'centerY', 0, 1).onChange(notify).name('Center Y (0=top, 1=bottom)').listen()
      spatialFolder.add(params, 'radiusFalloff', 0.1, 2).onChange(notify).name('Radius Falloff').listen()
      spatialFolder.open()

      // Waves/Noise folder
      const wavesFolder = gui.addFolder('Waves/Noise')
      wavesFolder.add(params, 'waveFrequency1', 1, 30).onChange(notify).name('Wave Freq 1 (density)').listen()
      wavesFolder.add(params, 'waveFrequency2', 1, 30).onChange(notify).name('Wave Freq 2 (density)').listen()
      wavesFolder.add(params, 'waveSpeed1', 0.01, 0.5).onChange(notify).name('Wave Speed 1').listen()
      wavesFolder.add(params, 'waveSpeed2', 0.01, 0.5).onChange(notify).name('Wave Speed 2').listen()
      wavesFolder.add(params, 'noiseStrength', 0, 1).onChange(notify).name('Noise Strength (0-1)').listen()
      wavesFolder.open()

      // Color folder
      const colorFolder = gui.addFolder('Color')
      colorFolder.add(params, 'colorIntensity', 0, 2).onChange(notify).name('Intensity (brightness)').listen()
      colorFolder.add(params, 'colorSaturation', 0, 2).onChange(notify).name('Saturation (vividness)').listen()
      // Note: Color cycles automatically through all brand colors
      colorFolder.open()

      // General folder
      const generalFolder = gui.addFolder('General')
      generalFolder.add(params, 'seed', 0, 1).onChange(notify).name('Random Seed').listen()
      generalFolder.add({ randomize: () => {
        params.seed = Math.random()
        gui.updateDisplay()
        notify()
      }}, 'randomize').name('🎲 Randomize Seed')
      generalFolder.add({ exportSettings: () => {
        console.log('=== SHADER SETTINGS EXPORT ===')
        console.log(JSON.stringify(params, null, 2))
        console.log('\n=== COPY/PASTE FORMAT ===')
        console.log('const SHADER_DEFAULTS = ' + JSON.stringify(params, null, 2))
      }}, 'exportSettings').name('📋 Export to Console')
      generalFolder.open()

      function notify() {
        if (onParamsChange) {
          onParamsChange(params)
        }
      }

      // Initial notification
      notify()
    })

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy()
      }
    }
  }, [onParamsChange])

  return null
}

