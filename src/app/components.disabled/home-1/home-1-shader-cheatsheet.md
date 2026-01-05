# Home-1 Shader Cheatsheet

Quick reference for exploring the WavyLinesHardSlow shader on the home-1 page.

## Overview

The shader creates a **black-dominated background** with **slow pulses of vivid brand color** flowing through the center (where the PLAYNE logo is). Think: meditative, dramatic color eruptions that return to calm black.

---

## Timing Controls

### Cycle Speed (0.01 - 0.5)
- **What it does**: Controls how fast the pulse cycle runs (black → color → black)
- **Low values (0.05)**: Very slow, meditative pulse (10-20 seconds)
- **High values (0.3)**: Faster, more energetic pulse (3-5 seconds)
- **Sweet spot**: 0.1 for a balanced, dramatic effect

### Pulse Start (0 - 1)
- **What it does**: When in the cycle color starts appearing
- **Lower values (0.2)**: Color appears earlier, longer visible
- **Higher values (0.4)**: Color appears later, shorter bursts
- **Tip**: Keep gap between start/end for smooth transitions

### Pulse End (0 - 1)
- **What it does**: When in the cycle color finishes and returns to black
- **Must be > Pulse Start**
- **Larger gap (0.3-0.7)**: Longer color presence
- **Smaller gap (0.4-0.6)**: Quick color flash

### Time Scale (0 - 2)
- **What it does**: Global speed multiplier for everything
- **0.5**: Slow motion (half speed)
- **1.0**: Normal speed
- **2.0**: Double speed
- **Use case**: Quick way to speed up/slow down entire shader

---

## Spatial Controls

### Center X (0 - 1)
- **0**: Color pulses from left edge
- **0.5**: Color pulses from center (LOGO POSITION!)
- **1**: Color pulses from right edge
- **Tip**: Keep at 0.5 to highlight the PLAYNE logo

### Center Y (0 - 1)
- **0**: Color pulses from top
- **0.5**: Color pulses from middle (LOGO POSITION!)
- **1**: Color pulses from bottom
- **Tip**: Keep at 0.5 to highlight the PLAYNE logo

### Radius Falloff (0.1 - 2)
- **What it does**: How quickly color fades as you move away from center
- **Low values (0.3)**: Tight spotlight effect, color only in center
- **Medium values (0.8)**: Balanced, fills most of screen
- **High values (1.5)**: Color spreads wide, gentle fade

---

## Waves/Noise Controls

These create the **organic, flowing movement** of the color (not just a uniform pulse).

### Wave Frequency 1 & 2 (1 - 30)
- **What they do**: Spatial density of wave patterns (like ripples in water)
- **Low values (5-10)**: Large, gentle waves
- **High values (20-30)**: Tight, intricate patterns
- **Tip**: Use different values for each to create complex interaction

### Wave Speed 1 & 2 (0.01 - 0.5)
- **What they do**: How fast the waves move across the screen
- **Low values (0.08)**: Slow drift
- **High values (0.3)**: Fast flow
- **Tip**: Vary speeds for more interesting movement

### Noise Strength (0 - 1)
- **0**: Uniform color pulse (no noise)
- **0.5**: Balanced - some flowing texture
- **1**: Full noise - color appears in organic, flowing patterns
- **Tip**: Higher values make it feel more "alive" and less mechanical

---

## Color Controls

### Intensity (0 - 2)
- **What it does**: How bright the color pulse is
- **Low (0.5)**: Subtle, whisper of color
- **Medium (1.0)**: Normal, clear color presence
- **High (1.5+)**: BLAZING, super vivid (may blow out)

### Saturation (0 - 2)
- **What it does**: How vivid the color is (color vs grayscale)
- **0**: Pure grayscale (no color, just brightness)
- **1**: Full saturation (pure brand color)
- **2**: HYPER-saturated (may look unnatural)

### Color Choice
- **Red**: Intense, energetic
- **Yellow**: Warm, optimistic (default)
- **Pink**: Playful, friendly
- **Blue**: Cool, calm

---

## General Controls

### Random Seed (0 - 1)
- **What it does**: Unique starting point for the wave patterns
- **Effect**: Different seeds = different wave patterns, but same overall movement
- **Tip**: Scrub this while watching to see variations

### 🎲 Randomize Seed
- Button to instantly generate a new random seed
- Use this to quickly explore different patterns

---

## Common Recipes

### 1. Subtle, Meditative (Logo Focus)
```
cycleSpeed: 0.08
pulseStart: 0.3
pulseEnd: 0.7
centerX/Y: 0.5
radiusFalloff: 0.8
waveFreq1: 10, waveFreq2: 15
waveSpeed1: 0.1, waveSpeed2: 0.08
noiseStrength: 0.5
colorIntensity: 1.0
colorSaturation: 1.0
```

### 2. Dramatic Burst
```
cycleSpeed: 0.2
pulseStart: 0.4
pulseEnd: 0.6
radiusFalloff: 1.2
noiseStrength: 0.7
colorIntensity: 1.5
colorSaturation: 1.2
```

### 3. Liquid Flow
```
cycleSpeed: 0.1
waveFreq1: 8, waveFreq2: 12
waveSpeed1: 0.2, waveSpeed2: 0.15
noiseStrength: 0.8
radiusFalloff: 1.0
```

### 4. Minimal/Clean
```
cycleSpeed: 0.05
pulseStart: 0.35
pulseEnd: 0.65
radiusFalloff: 0.6
noiseStrength: 0.3
colorIntensity: 0.8
```

---

## Keyboard Shortcuts

- **L**: Log all home-1 component states (excludes shader - shader is not in LSO)
- Open dat.gui to adjust shader in real-time

---

## Technical Notes

- Shader uses **seedrandom** for reproducible patterns
- Color palette: All PLAYNE brand colors (red, yellow, pink, blue) except offwhite
- Always returns to black between pulses
- Designed for slow, meditative background presence
- Focus is on the center (logo area) with radial falloff

---

## Tips for Exploration

1. **Start with Timing**: Set the cycle speed and pulse window first
2. **Find Your Center**: Adjust radiusFalloff to control how much of screen gets color
3. **Add Movement**: Play with wave frequencies and speeds
4. **Mix with Noise**: Higher noise = more organic, lower = more uniform
5. **Refine Color**: Tweak intensity/saturation last for final polish
6. **Try Different Seeds**: Same settings, different patterns!

---

**Pro Tip**: The shader is **multiplicative** - if pulse cycle is 0 (black), no amount of intensity will show color. Make sure your pulse window and timing allow color to appear!

