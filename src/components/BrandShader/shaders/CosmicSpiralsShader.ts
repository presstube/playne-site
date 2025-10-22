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

export function getRandomCosmicColors(): number[] {
  const count = Math.floor(Math.random() * 2) + 3 // 3-4 colors for spirals
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

export function getCosmicColorCount(flatColors: number[]): number {
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

  // Hash for stars
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

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
    
    // Rotate the entire galaxy
    float rotation = uTime * 0.2;
    angle += rotation;
    
    vec3 finalColor = vec3(0.0, 0.0, 0.05); // Dark space background
    
    // Create spiral arms
    float numArms = float(colorCount);
    
    for (int i = 0; i < 5; i++) {
      if (i >= colorCount) break;
      
      // Each arm has an offset angle
      float armAngle = float(i) * (2.0 * PI / numArms);
      
      // Logarithmic spiral equation
      float spiralTightness = 0.3;
      float spiralAngle = angle - armAngle;
      float expectedRadius = exp(spiralTightness * spiralAngle);
      
      // Normalize and create multiple wraps
      float wrappedRadius = mod(expectedRadius, 3.0);
      
      // Distance from this spiral arm
      float distToSpiral = abs(log(radius + 0.1) - log(wrappedRadius + 0.1));
      
      // Arm width and intensity
      float armWidth = 0.3;
      float armIntensity = exp(-distToSpiral / armWidth);
      
      // Fade based on radius
      float radialFade = 1.0 - smoothstep(0.0, 1.0, radius);
      armIntensity *= radialFade;
      
      // Add some variation along the arm
      float variation = sin(angle * 10.0 + uTime) * 0.3 + 0.7;
      armIntensity *= variation;
      
      // Mix in this arm's color
      finalColor += uColors[i] * armIntensity * 0.7;
    }
    
    // Add twinkling stars
    vec2 starCoord = uv * 40.0;
    vec2 starId = floor(starCoord);
    vec2 starUv = fract(starCoord);
    
    float starRandom = hash(starId);
    
    // Only some cells have stars
    if (starRandom > 0.95) {
      vec2 starPos = vec2(hash(starId + vec2(1.0)), hash(starId + vec2(2.0)));
      float starDist = length(starUv - starPos);
      
      // Twinkling
      float twinkle = sin(uTime * 3.0 + starRandom * 10.0) * 0.5 + 0.5;
      
      float star = smoothstep(0.05, 0.0, starDist) * twinkle;
      finalColor += vec3(star * 0.8);
    }
    
    // Add glow in center
    float centerGlow = exp(-radius * 2.0) * 0.4;
    finalColor += vec3(centerGlow);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const initialColors = getRandomCosmicColors()

export const cosmicSpiralsShader: ShaderConfig = {
  key: '7',
  name: 'Cosmic Spirals',
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uColors: { value: initialColors },
    uColorCount: { value: getCosmicColorCount(initialColors) }
  }
}

