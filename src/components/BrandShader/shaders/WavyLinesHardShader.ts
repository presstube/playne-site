import { ShaderConfig } from './types'

// PLAYNE Brand Colors (excluding black and offwhite)
const brandColorPalette = [
  [0.988, 0.333, 0.357],  // brandRed
  [0.988, 0.863, 0.290],  // brandYellow
  [0.984, 0.427, 0.796],  // brandPink
  [0.663, 0.925, 0.831],  // brandBlue
]

// Get 2-4 random colors from the palette
export function getRandomColorSet(): number[] {
  const count = Math.floor(Math.random() * 3) + 2 // 2-4 colors
  const indices = [0, 1, 2, 3]
  
  // Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  
  // Build flat array of RGB values (up to 5 colors = 15 values)
  const flatColors: number[] = []
  for (let i = 0; i < 5; i++) {
    if (i < count) {
      const color = brandColorPalette[indices[i]]
      flatColors.push(color[0], color[1], color[2])
    } else {
      // Pad with zeros
      flatColors.push(0, 0, 0)
    }
  }
  
  return flatColors
}

// Helper to get color count from flat array
export function getColorCount(flatColors: number[]): number {
  let count = 0
  for (let i = 0; i < 5; i++) {
    const r = flatColors[i * 3]
    const g = flatColors[i * 3 + 1]
    const b = flatColors[i * 3 + 2]
    if (r !== 0 || g !== 0 || b !== 0) {
      count++
    }
  }
  return count
}

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColors[5];
  uniform int uColorCount;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Create multiple sine wave layers
    float wave1 = sin(uv.x * 10.0 + uTime * 1.5) * 0.5 + 0.5;
    float wave2 = sin(uv.x * 15.0 - uTime * 1.2 + uv.y * 5.0) * 0.5 + 0.5;
    float wave3 = sin(uv.y * 8.0 + uTime * 0.8) * 0.5 + 0.5;
    float wave4 = sin((uv.x + uv.y) * 12.0 + uTime) * 0.5 + 0.5;
    
    // Combine waves
    float combined = (wave1 + wave2 + wave3 + wave4) / 4.0;
    
    // Add some vertical stripes that move
    float stripes = sin(uv.x * 20.0 + uTime * 2.0) * 0.5 + 0.5;
    combined = mix(combined, stripes, 0.3);
    
    // HARD EDGE: Use floor to quantize the value into discrete bands
    int colorCount = uColorCount;
    if (colorCount < 2) colorCount = 2;
    if (colorCount > 5) colorCount = 5;
    
    // Create hard edges by flooring to discrete bands
    float bands = float(colorCount);
    float bandIndex = floor(combined * bands);
    
    // Map to color index
    int colorIndex = int(mod(bandIndex, float(colorCount)));
    vec3 color = uColors[colorIndex];
    
    // Optional: Add subtle edge darkening for definition
    float edgeThreshold = 0.02;
    float nextBand = floor((combined + edgeThreshold) * bands);
    if (nextBand != bandIndex) {
      color *= 0.92;
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Initialize with random colors
const initialColors = getRandomColorSet()

export const wavyLinesHardShader: ShaderConfig = {
  key: '7',
  name: 'Wavy Lines Hard',
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uColors: { value: initialColors },
    uColorCount: { value: getColorCount(initialColors) }
  }
}

