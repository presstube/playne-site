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
export function getRandomBlobColors(): number[] {
  const count = Math.floor(Math.random() * 3) + 3 // 3-5 colors
  const indices = [0, 1, 2, 3, 4, 5]
  
  // Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  
  // Build flat array (up to 5 colors)
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

export function getBlobColorCount(flatColors: number[]): number {
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

  // Metaball function - blobs merge when close
  float metaball(vec2 p, vec2 center, float radius) {
    float d = length(p - center);
    return radius / (d * d);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * 2.0;
    
    // Zoom out to see more blobs (increased scale)
    p *= 2.5;
    p.x *= uResolution.x / uResolution.y;
    
    int colorCount = uColorCount;
    if (colorCount < 3) colorCount = 3;
    if (colorCount > 5) colorCount = 5;
    
    // Create moving blobs
    float field = 0.0;
    vec3 mixedColor = vec3(0.0);
    
    for (int i = 0; i < 5; i++) {
      if (i >= colorCount) break;
      
      // Each blob moves in a tighter circular pattern
      float angle = uTime * (0.3 + float(i) * 0.15) + float(i) * 2.0;
      float radius = 0.4 + sin(uTime * 0.5 + float(i)) * 0.15;
      vec2 center = vec2(
        cos(angle) * radius,
        sin(angle * 1.3) * radius * 0.8
      );
      
      // Smaller blob radius for more definition
      float blob = metaball(p, center, 0.15);
      field += blob;
      
      // Mix colors based on blob influence
      mixedColor += uColors[i] * blob;
    }
    
    // Normalize color
    if (field > 0.0) {
      mixedColor /= field;
    }
    
    // Smooth threshold for blob edges
    float alpha = smoothstep(0.8, 1.2, field);
    
    // Add some glow
    float glow = smoothstep(0.4, 0.8, field) * 0.3;
    mixedColor += vec3(glow);
    
    // Add color variation based on field strength
    mixedColor *= (0.8 + field * 0.2);
    
    gl_FragColor = vec4(mixedColor, alpha);
  }
`

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const initialColors = getRandomBlobColors()

export const bubblegumBlobsShader: ShaderConfig = {
  key: '3',
  name: 'Bubblegum Blobs',
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uColors: { value: initialColors },
    uColorCount: { value: getBlobColorCount(initialColors) }
  }
}

