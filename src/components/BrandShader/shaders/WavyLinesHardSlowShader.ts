import { ShaderConfig } from './types'

// PLAYNE Brand Colors - vivid versions for dramatic pulses
const brandColorPalette = [
  [0.988, 0.333, 0.357],  // brandRed - vivid
  [0.988, 0.863, 0.290],  // brandYellow - vivid
  [0.984, 0.427, 0.796],  // brandPink - vivid
  [0.663, 0.925, 0.831],  // brandBlue - vivid
]

// Get color by index
export function getColorByIndex(index: number): number[] {
  const color = brandColorPalette[index % brandColorPalette.length]
  return [color[0], color[1], color[2]]
}

// Randomly pick one brand color
export function getRandomColor(): number[] {
  const index = Math.floor(Math.random() * brandColorPalette.length)
  return getColorByIndex(index)
}

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uSeed;
  uniform vec3 uAccentColor;
  
  // Timing controls
  uniform float uCycleSpeed;
  uniform float uPulseStart;
  uniform float uPulseEnd;
  uniform float uTimeScale;
  
  // Spatial controls
  uniform float uCenterX;
  uniform float uCenterY;
  uniform float uRadiusFalloff;
  
  // Wave/Noise controls
  uniform float uWaveFreq1;
  uniform float uWaveFreq2;
  uniform float uWaveSpeed1;
  uniform float uWaveSpeed2;
  uniform float uNoiseStrength;
  
  // Color controls
  uniform float uColorIntensity;
  uniform float uColorSaturation;
  
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec3 black = vec3(0.137, 0.122, 0.125);
    
    // Seed offset for variation
    float seedOffset = uSeed * 100.0;
    
    // Use SAWTOOTH wave instead of sine to avoid double-pulse
    // Sawtooth goes 0 → 1 linearly, then resets to 0 (perfect for one pulse per cycle)
    float scaledTime = uTime * uTimeScale;
    float rawCycle = scaledTime * uCycleSpeed + seedOffset;
    float pulseRaw = fract(rawCycle); // fract() gives us sawtooth: 0 → 1, repeat
    
    // Map pulse to intensity with start/end thresholds
    float pulseIntensity = 0.0;
    if (pulseRaw > uPulseStart && pulseRaw < uPulseEnd) {
      // Scale to 0-1 within the pulse window
      float normalized = (pulseRaw - uPulseStart) / (uPulseEnd - uPulseStart);
      // Smooth in and out with sine for organic feel
      pulseIntensity = sin(normalized * 3.14159) * uColorIntensity;
    }
    
    // Distance from center for radial falloff
    vec2 center = vec2(uCenterX, uCenterY);
    float dist = distance(uv, center);
    float radialMask = 1.0 - smoothstep(0.0, uRadiusFalloff, dist);
    
    // Layered sine waves for organic movement (noise-like)
    float wave1 = sin(uv.x * uWaveFreq1 + scaledTime * uWaveSpeed1 + seedOffset) * 0.5 + 0.5;
    float wave2 = sin(uv.x * uWaveFreq2 - scaledTime * uWaveSpeed2 + uv.y * 5.0 + seedOffset * 0.7) * 0.5 + 0.5;
    float wave3 = sin(uv.y * 8.0 + scaledTime * 0.08 + seedOffset * 1.3) * 0.5 + 0.5;
    float wave4 = sin((uv.x + uv.y) * 12.0 + scaledTime * 0.1 + seedOffset * 0.5) * 0.5 + 0.5;
    
    // Combine waves
    float noise = (wave1 + wave2 + wave3 + wave4) / 4.0;
    
    // Apply noise strength to modulate the color appearance
    float noiseMask = mix(1.0, noise, uNoiseStrength);
    
    // Combine all masks
    float finalMask = pulseIntensity * radialMask * noiseMask;
    
    // Mix between black and accent color based on final mask
    vec3 saturatedColor = mix(
      vec3(dot(uAccentColor, vec3(0.299, 0.587, 0.114))), // grayscale
      uAccentColor,
      uColorSaturation
    );
    
    vec3 color = mix(black, saturatedColor, finalMask);
    
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

// Initialize with random color and seed
const initialColor = getRandomColor()
const randomSeed = Math.random()

export const wavyLinesHardSlowShader: ShaderConfig = {
  key: '9',
  name: 'Wavy Lines Hard Slow',
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uSeed: { value: randomSeed },
    uAccentColor: { value: initialColor },
    
    // Timing
    uCycleSpeed: { value: 0.1 },
    uPulseStart: { value: 0.3 },
    uPulseEnd: { value: 0.7 },
    uTimeScale: { value: 1.0 },
    
    // Spatial
    uCenterX: { value: 0.5 },
    uCenterY: { value: 0.5 },
    uRadiusFalloff: { value: 0.8 },
    
    // Waves/Noise
    uWaveFreq1: { value: 10.0 },
    uWaveFreq2: { value: 15.0 },
    uWaveSpeed1: { value: 0.15 },
    uWaveSpeed2: { value: 0.12 },
    uNoiseStrength: { value: 0.5 },
    
    // Color
    uColorIntensity: { value: 1.0 },
    uColorSaturation: { value: 1.0 }
  }
}
