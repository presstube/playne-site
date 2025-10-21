import { perlinNoiseShader } from './PerlinNoiseShader'
import { wavyLinesShader } from './WavyLinesShader'
import { ShaderConfig } from './types'

export const shaderRegistry: ShaderConfig[] = [
  perlinNoiseShader,
  wavyLinesShader
]

export const getShaderByKey = (key: string): ShaderConfig | undefined => {
  return shaderRegistry.find(shader => shader.key === key)
}

export const getShaderByIndex = (index: number): ShaderConfig | undefined => {
  return shaderRegistry[index % shaderRegistry.length]
}

