'use client'

import { useRef, useMemo, useImperativeHandle, forwardRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ShaderConfig } from './shaders/types'

interface ShaderPlaneProps {
  shader: ShaderConfig
  materialRef: React.MutableRefObject<THREE.ShaderMaterial | null>
}

function ShaderPlane({ shader, materialRef }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Create shader material with cloned uniforms
  const material = useMemo(() => {
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: [window.innerWidth, window.innerHeight] },
      ...shader.uniforms
    }
    
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: shader.vertexShader || `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: shader.fragmentShader,
      side: THREE.DoubleSide
    })
    
    materialRef.current = mat
    return mat
  }, [shader, materialRef])

  // Update time uniform on each frame
  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial
      mat.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  // Handle window resize
  useMemo(() => {
    const handleResize = () => {
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.ShaderMaterial
        mat.uniforms.uResolution.value = [window.innerWidth, window.innerHeight]
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 4]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

interface ShaderCanvasProps {
  shader: ShaderConfig
}

export interface ShaderCanvasHandle {
  getMaterial: () => THREE.ShaderMaterial | null
}

const ShaderCanvas = forwardRef<ShaderCanvasHandle, ShaderCanvasProps>(({ shader }, ref) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  
  useImperativeHandle(ref, () => ({
    getMaterial: () => materialRef.current
  }))
  
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 75 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: false }}
    >
      <ShaderPlane shader={shader} materialRef={materialRef} />
    </Canvas>
  )
})

ShaderCanvas.displayName = 'ShaderCanvas'

export default ShaderCanvas


