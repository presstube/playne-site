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

// Get 3-5 random colors
export function getRandomRippleColors(): number[] {
  const count = Math.floor(Math.random() * 3) + 3 // 3-5 colors
  const indices = [0, 1, 2, 3, 4, 5]
  
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  
  const flatColors: number[] = []
  for (let i = 0; i < 5; i++) {
    if (i < count) {
      const color = brandColorPalette[indices[i]]
      flatColors.push(color[0], color[1], color[2])
    } else {
      flatColors.push(0, 0, 0)
    }
  }
  
  return flatColors
}

export function getRippleColorCount(flatColors: number[]): number {
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
    vec2 p = (uv - 0.5) * 2.0;
    p.x *= uResolution.x / uResolution.y;
    
    int colorCount = uColorCount;
    if (colorCount < 3) colorCount = 3;
    if (colorCount > 5) colorCount = 5;
    
    // Distance from center
    float dist = length(p);
    
    // Create multiple ripple layers with different frequencies
    float ripple1 = sin(dist * 20.0 - uTime * 2.0);
    float ripple2 = sin(dist * 15.0 - uTime * 1.5 + 1.0);
    float ripple3 = sin(dist * 10.0 - uTime * 1.0 + 2.0);
    
    // Combine ripples
    float combined = (ripple1 + ripple2 + ripple3) / 3.0;
    
    // Map to 0-1 range
    float t = combined * 0.5 + 0.5;
    
    // Interpolate through colors
    float segmentSize = 1.0 / float(colorCount - 1);
    int segment = int(floor(t / segmentSize));
    if (segment >= colorCount - 1) segment = colorCount - 2;
    
    float localT = (t - float(segment) * segmentSize) / segmentSize;
    vec3 color = mix(uColors[segment], uColors[segment + 1], localT);
    
    // Add radial fade from center
    float fade = 1.0 - smoothstep(0.0, 1.2, dist);
    color *= fade;
    
    // Add brightness variation based on ripples
    float brightness = 0.8 + combined * 0.3;
    color *= brightness;
    
    // Add subtle glow at ripple peaks
    float glow = smoothstep(0.6, 1.0, abs(combined)) * 0.2;
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

const initialColors = getRandomRippleColors()

export const rainbowRipplesShader: ShaderConfig = {
  key: '4',
  name: 'Rainbow Ripples',
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uColors: { value: initialColors },
    uColorCount: { value: getRippleColorCount(initialColors) }
  }
}

