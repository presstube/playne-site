import { perlinNoiseShader } from './PerlinNoiseShader'
import { wavyLinesShader } from './WavyLinesShader'
import { bubblegumBlobsShader } from './BubblegumBlobsShader'
import { rainbowRipplesShader } from './RainbowRipplesShader'
import { kaleidoscopeDreamsShader } from './KaleidoscopeDreamsShader'
import { confettiCelebrationShader } from './ConfettiCelebrationShader'
import { cosmicSpiralsShader } from './CosmicSpiralsShader'
import { seascapeShader } from './SeascapeShader'
import { ShaderConfig } from './types'

export const shaderRegistry: ShaderConfig[] = [
  perlinNoiseShader,
  wavyLinesShader,
  bubblegumBlobsShader,
  rainbowRipplesShader,
  kaleidoscopeDreamsShader,
  confettiCelebrationShader,
  cosmicSpiralsShader,
  seascapeShader
]

export const getShaderByKey = (key: string): ShaderConfig | undefined => {
  return shaderRegistry.find(shader => shader.key === key)
}

export const getShaderByIndex = (index: number): ShaderConfig | undefined => {
  return shaderRegistry[index % shaderRegistry.length]
}

