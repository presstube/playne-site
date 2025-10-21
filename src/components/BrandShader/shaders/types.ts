export interface ShaderUniforms {
  uTime: { value: number }
  uResolution: { value: [number, number] }
  [key: string]: { value: any }
}

export interface ShaderConfig {
  key: string
  name: string
  fragmentShader: string
  vertexShader?: string
  uniforms: ShaderUniforms
}

