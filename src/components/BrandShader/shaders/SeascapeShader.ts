import { ShaderConfig } from './types'

// Adapted from "Seascape" by Alexander Alekseev aka TDM - 2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// PLAYNE Brand Colors (all 6)
const brandColorPalette = [
  [0.137, 0.122, 0.125],  // brandBlack
  [0.988, 0.333, 0.357],  // brandRed
  [0.988, 0.863, 0.290],  // brandYellow
  [0.984, 0.427, 0.796],  // brandPink
  [0.663, 0.925, 0.831],  // brandBlue
  [0.918, 0.918, 0.855],  // brandOffwhite
]

export function getRandomSeascapeColors(): number[] {
  // Pick 2 colors for water and sky
  const indices = [0, 1, 2, 3, 4, 5]
  
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  
  const waterColor = brandColorPalette[indices[0]]
  const skyColor = brandColorPalette[indices[1]]
  
  // Return as flat array: [water r,g,b, sky r,g,b]
  return [
    waterColor[0], waterColor[1], waterColor[2],
    skyColor[0], skyColor[1], skyColor[2]
  ]
}

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uWaterColor;
  uniform vec3 uSkyColor;
  varying vec2 vUv;

  #define PI 3.141592
  #define EPSILON 1e-3
  #define NUM_STEPS 32
  #define ITER_GEOMETRY 3
  #define ITER_FRAGMENT 5
  
  const float SEA_HEIGHT = 0.6;
  const float SEA_CHOPPY = 4.0;
  const float SEA_SPEED = 0.8;
  const float SEA_FREQ = 0.16;
  const mat2 octave_m = mat2(1.6, 1.2, -1.2, 1.6);
  
  // Math utilities
  mat3 fromEuler(vec3 ang) {
    vec2 a1 = vec2(sin(ang.x), cos(ang.x));
    vec2 a2 = vec2(sin(ang.y), cos(ang.y));
    vec2 a3 = vec2(sin(ang.z), cos(ang.z));
    mat3 m;
    m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x, a1.y*a2.x*a3.x+a3.y*a1.x, -a2.y*a3.x);
    m[1] = vec3(-a2.y*a1.x, a1.y*a2.y, a2.x);
    m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x, a1.x*a3.x-a1.y*a3.y*a2.x, a2.y*a3.y);
    return m;
  }
  
  float hash(vec2 p) {
    float h = dot(p, vec2(127.1, 311.7));
    return fract(sin(h) * 43758.5453123);
  }
  
  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return -1.0 + 2.0 * mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y
    );
  }
  
  // Lighting
  float diffuse(vec3 n, vec3 l, float p) {
    return pow(dot(n, l) * 0.4 + 0.6, p);
  }
  
  float specular(vec3 n, vec3 l, vec3 e, float s) {
    float nrm = (s + 8.0) / (PI * 8.0);
    return pow(max(dot(reflect(e, n), l), 0.0), s) * nrm;
  }
  
  // Sky using brand color
  vec3 getSkyColor(vec3 e) {
    e.y = (max(e.y, 0.0) * 0.8 + 0.2) * 0.8;
    float gradient = pow(1.0 - e.y, 2.0);
    return mix(uSkyColor, uSkyColor * 1.5, gradient);
  }
  
  // Sea octave
  float sea_octave(vec2 uv, float choppy) {
    uv += noise(uv);
    vec2 wv = 1.0 - abs(sin(uv));
    vec2 swv = abs(cos(uv));
    wv = mix(wv, swv, wv);
    return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
  }
  
  // Height map
  float map(vec3 p, float time) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz;
    uv.x *= 0.75;
    
    float d, h = 0.0;
    for(int i = 0; i < ITER_GEOMETRY; i++) {
      d = sea_octave((uv + time) * freq, choppy);
      d += sea_octave((uv - time) * freq, choppy);
      h += d * amp;
      uv *= octave_m;
      freq *= 1.9;
      amp *= 0.22;
      choppy = mix(choppy, 1.0, 0.2);
    }
    return p.y - h;
  }
  
  float map_detailed(vec3 p, float time) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz;
    uv.x *= 0.75;
    
    float d, h = 0.0;
    for(int i = 0; i < ITER_FRAGMENT; i++) {
      d = sea_octave((uv + time) * freq, choppy);
      d += sea_octave((uv - time) * freq, choppy);
      h += d * amp;
      uv *= octave_m;
      freq *= 1.9;
      amp *= 0.22;
      choppy = mix(choppy, 1.0, 0.2);
    }
    return p.y - h;
  }
  
  // Normal calculation
  vec3 getNormal(vec3 p, float eps, float time) {
    vec3 n;
    n.y = map_detailed(p, time);
    n.x = map_detailed(vec3(p.x + eps, p.y, p.z), time) - n.y;
    n.z = map_detailed(vec3(p.x, p.y, p.z + eps), time) - n.y;
    n.y = eps;
    return normalize(n);
  }
  
  // Get sea color using brand colors
  vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {
    float fresnel = clamp(1.0 - dot(n, -eye), 0.0, 1.0);
    fresnel = min(fresnel * fresnel * fresnel, 0.5);
    
    vec3 reflected = getSkyColor(reflect(eye, n));
    vec3 refracted = uWaterColor * 0.3 + diffuse(n, l, 80.0) * uWaterColor * 0.5;
    
    vec3 color = mix(refracted, reflected, fresnel);
    
    float atten = max(1.0 - dot(dist, dist) * 0.001, 0.0);
    color += uWaterColor * (p.y - SEA_HEIGHT) * 0.18 * atten;
    
    color += uWaterColor * specular(n, l, eye, 600.0 * inversesqrt(dot(dist, dist))) * 0.5;
    
    return color;
  }
  
  // Ray marching
  float heightMapTracing(vec3 ori, vec3 dir, out vec3 p, float time) {
    float tm = 0.0;
    float tx = 1000.0;
    float hx = map(ori + dir * tx, time);
    if(hx > 0.0) {
      p = ori + dir * tx;
      return tx;
    }
    float hm = map(ori, time);
    for(int i = 0; i < NUM_STEPS; i++) {
      float tmid = mix(tm, tx, hm / (hm - hx));
      p = ori + dir * tmid;
      float hmid = map(p, time);
      if(hmid < 0.0) {
        tx = tmid;
        hx = hmid;
      } else {
        tm = tmid;
        hm = hmid;
      }
      if(abs(hmid) < EPSILON) break;
    }
    return mix(tm, tx, hm / (hm - hx));
  }
  
  void main() {
    float time = uTime * 0.3 * SEA_SPEED + 1.0;
    vec2 coord = vUv * uResolution;
    vec2 uv = coord / uResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;
    
    // Ray
    vec3 ang = vec3(sin(time * 3.0) * 0.1, sin(time) * 0.2 + 0.3, time);
    vec3 ori = vec3(0.0, 3.5, time * 5.0);
    vec3 dir = normalize(vec3(uv.xy, -2.0));
    dir.z += length(uv) * 0.14;
    dir = normalize(dir) * fromEuler(ang);
    
    // Tracing
    vec3 p;
    heightMapTracing(ori, dir, p, time);
    vec3 dist = p - ori;
    float eps = dot(dist, dist) * (0.1 / uResolution.x);
    vec3 n = getNormal(p, eps, time);
    vec3 light = normalize(vec3(0.0, 1.0, 0.8));
    
    // Color
    vec3 color = mix(
      getSkyColor(dir),
      getSeaColor(p, n, light, dir, dist),
      pow(smoothstep(0.0, -0.02, dir.y), 0.2)
    );
    
    // Post processing
    color = pow(color, vec3(0.65));
    
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

const initialColors = getRandomSeascapeColors()

export const seascapeShader: ShaderConfig = {
  key: '8',
  name: 'Seascape Dreams',
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uWaterColor: { value: [initialColors[0], initialColors[1], initialColors[2]] },
    uSkyColor: { value: [initialColors[3], initialColors[4], initialColors[5]] }
  }
}

