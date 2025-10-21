import { ShaderConfig } from './types'

// PLAYNE Brand Colors (all 6)
const brandColorPalette = [
  [0.137, 0.122, 0.125],  // brandBlack
  [0.988, 0.333, 0.357],  // brandRed
  [0.988, 0.863, 0.290],  // brandYellow
  [0.984, 0.427, 0.796],  // brandPink
  [0.663, 0.925, 0.831],  // brandBlue
  [0.918, 0.918, 0.855],  // brandOffwhite
]

// Get 2-5 random colors from the palette
export function getRandomColorSet(): number[] {
  const count = Math.floor(Math.random() * 4) + 2 // 2-5 colors
  const indices = [0, 1, 2, 3, 4, 5]
  
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
    
    // Map to brand colors with smooth transitions
    vec3 color;
    float t = combined;
    
    // Interpolate through the active colors
    int colorCount = uColorCount;
    if (colorCount < 2) colorCount = 2;
    if (colorCount > 5) colorCount = 5;
    
    float segmentSize = 1.0 / float(colorCount - 1);
    int segment = int(floor(t / segmentSize));
    if (segment >= colorCount - 1) segment = colorCount - 2;
    
    float localT = (t - float(segment) * segmentSize) / segmentSize;
    color = mix(uColors[segment], uColors[segment + 1], localT);
    
    // Add some brightness variation based on waves
    float brightness = 0.7 + wave1 * 0.4;
    color *= brightness;
    
    // Add some subtle glow in the wave peaks
    float glow = smoothstep(0.7, 1.0, wave1) * 0.3;
    color += vec3(glow);
    
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

export const wavyLinesShader: ShaderConfig = {
  key: '2',
  name: 'Wavy Lines',
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uColors: { value: initialColors },
    uColorCount: { value: getColorCount(initialColors) }
  }
}


