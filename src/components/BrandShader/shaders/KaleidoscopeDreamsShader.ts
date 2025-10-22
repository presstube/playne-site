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

export function getRandomKaleidoscopeColors(): number[] {
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

export function getKaleidoscopeColorCount(flatColors: number[]): number {
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

  #define PI 3.14159265359

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * 2.0;
    p.x *= uResolution.x / uResolution.y;
    
    int colorCount = uColorCount;
    if (colorCount < 3) colorCount = 3;
    if (colorCount > 5) colorCount = 5;
    
    // Convert to polar coordinates
    float angle = atan(p.y, p.x);
    float radius = length(p);
    
    // Create 6-fold symmetry (kaleidoscope)
    float segments = 6.0;
    angle = mod(angle, PI * 2.0 / segments);
    angle = abs(angle - PI / segments);
    
    // Rotate over time
    float rotation = uTime * 0.3;
    angle += rotation;
    
    // Create pattern layers
    float pattern1 = sin(radius * 10.0 + angle * 5.0 - uTime);
    float pattern2 = sin(radius * 15.0 - angle * 3.0 + uTime * 0.5);
    float pattern3 = sin((radius + angle) * 8.0 + uTime * 0.7);
    
    // Combine patterns
    float combined = (pattern1 + pattern2 + pattern3) / 3.0;
    
    // Add concentric circles
    float circles = sin(radius * 20.0 - uTime * 2.0);
    combined = mix(combined, circles, 0.3);
    
    // Map to 0-1
    float t = combined * 0.5 + 0.5;
    
    // Color interpolation
    float segmentSize = 1.0 / float(colorCount - 1);
    int segment = int(floor(t / segmentSize));
    if (segment >= colorCount - 1) segment = colorCount - 2;
    
    float localT = (t - float(segment) * segmentSize) / segmentSize;
    vec3 color = mix(uColors[segment], uColors[segment + 1], localT);
    
    // Add radial fade
    float fade = 1.0 - smoothstep(0.0, 1.2, radius);
    color *= fade;
    
    // Brightness variation
    float brightness = 0.7 + combined * 0.4;
    color *= brightness;
    
    // Add shimmer effect
    float shimmer = sin(radius * 30.0 + uTime * 3.0) * 0.1;
    color += vec3(shimmer);
    
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

const initialColors = getRandomKaleidoscopeColors()

export const kaleidoscopeDreamsShader: ShaderConfig = {
  key: '5',
  name: 'Kaleidoscope Dreams',
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uColors: { value: initialColors },
    uColorCount: { value: getKaleidoscopeColorCount(initialColors) }
  }
}

