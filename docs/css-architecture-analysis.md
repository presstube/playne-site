# PLAYNE Site CSS Architecture Analysis

**Date:** January 2, 2025  
**Status:** Clean, well-organized foundation

---

## Architecture Summary

**Grade: A-** - Clean, consistent, well-architected

The site uses a **two-tier CSS system:**

1. **Global Foundation** - `src/app/globals.css`
2. **Component Modules** - Co-located `.module.css` files

---

## Tier 1: Global Foundation (`globals.css`)

### What It Provides

#### 1. CSS Reset
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

#### 2. Brand Design Tokens (CSS Custom Properties)
```css
:root {
  /* Brand Colors */
  --brand-black: #231f20;
  --brand-red: #FC555B;
  --brand-yellow: #FCDC4A;
  --brand-pink: #FB6DCB;
  --brand-blue: #A9ECD4;
  --brand-offwhite: #EAEADA;
  
  /* Typography */
  --font-family-sans: 'Parkinsans', ...;
  --font-family-display: 'Krana Fat Trial', ...;
  
  /* Spacing Scale (0.25rem → 12.5rem) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  ...
  --space-12: 12.5rem;  /* 200px */
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.5rem;
}
```

#### 3. Global Utility Classes
```css
/* Typography */
.font-display { font-family: var(--font-family-display); }
.font-sans { font-family: var(--font-family-sans); }

/* Brand Colors - Background */
.bg-brand-black { background-color: var(--brand-black); }
.bg-brand-red { background-color: var(--brand-red); }
/* ... etc */

/* Brand Colors - Text */
.text-brand-black { color: var(--brand-black); }
/* ... etc */

/* Spacing */
.section-space { margin-bottom: var(--space-12); }
.module-space { margin-bottom: var(--space-8); }
```

#### 4. Base HTML Styles
```css
html {
  font-size: 16px;
  overflow-x: clip;
}

body {
  font-family: var(--font-family-sans);
  line-height: 1.6;
  color: var(--color-text-primary);
  background-color: var(--color-background-primary);
}
```

---

## Tier 2: Component CSS Modules

### Pattern: Co-located Scoped Styles

Each component has its own `.module.css` file:

```
src/
  components/
    PageHero/
      PageHero.tsx
      PageHero.module.css  ← Scoped to this component
  app/
    HomePage/
      HomePage.tsx
      HomePage.module.css  ← Scoped to this page
```

### How Modules Use Global Foundation

Components reference CSS custom properties from `globals.css`:

```css
/* PageHero.module.css */
.hero {
  padding: 3rem 0 4rem;
  background: linear-gradient(
    135deg, 
    var(--color-background-primary) 0%,    /* ← From globals */
    var(--color-background-secondary) 100%
  );
  border-radius: 1rem;
  margin-bottom: 3rem;
}

.title {
  color: var(--color-text-primary);  /* ← From globals */
  font-weight: 700;
}
```

```css
/* HomePage.module.css */
.heroSection {
  padding: var(--space-12) var(--space-4);  /* ← From globals */
  margin-bottom: var(--space-12);
}

.heroHeadline {
  font-family: var(--font-family-display);  /* ← From globals */
  color: var(--brand-black);                 /* ← From globals */
}
```

---

## Key Architectural Decisions

### ✅ CSS Custom Properties (CSS Variables)
- **All brand tokens** defined in `:root`
- **Available globally** to all components
- **Consistent theming** without prop drilling
- **Easy to maintain** - change once, updates everywhere

### ✅ CSS Modules for Components
- **Scoped by default** - no naming collisions
- **Co-located** - styles live next to components
- **Import as JS object** - `styles.hero`, `styles.title`
- **Type-safe** (with TypeScript)

### ✅ Utility Classes (Minimal)
- **Only essential utilities** in globals
- **Component-specific styles** stay in modules
- **Not trying to be Tailwind** - just helpers

### ✅ Spacing Scale
- **Consistent rhythm** using `--space-*` tokens
- **Rem-based** (relative to root font size)
- **From 4px to 200px** (12 steps)

---

## RootLayout Frameless Mode

The site has a special feature for full-screen experiences:

```typescript
// RootLayout.tsx
const isFrameless = pathname?.startsWith('/components') || pathname?.startsWith('/story')

return (
  <>
    {!isFrameless && <Topnav />}  // Hide nav for frameless pages
    <main className={isFrameless ? styles.mainFrameless : styles.main}>
      {children}
    </main>
  </>
)
```

```css
/* RootLayout.module.css */
.mainFrameless {
  max-width: none;
  padding: 0 !important;
  margin: 0;
  width: 100%;
}

.containerFrameless {
  padding: 0 !important;
  margin: 0;
  width: 100%;
  max-width: none;
}
```

**Used by:**
- `/story/*` pages (like `/story-fragment`)
- `/components/*` demo pages

**Result:** Full-screen, no nav, no padding, no max-width

---

## How `/story-fragment` Should Use This

### ✅ What You Should Use

#### 1. Brand Color Variables
```css
/* StoryFragment.module.css */
.workspace {
  background-color: var(--brand-offwhite);  /* ✅ Use this */
}

.toolbar {
  background-color: var(--brand-black);     /* ✅ Use this */
}
```

#### 2. Frameless Layout
Already working! The path `/story-fragment` matches the frameless check:
```typescript
const isFrameless = pathname?.startsWith('/story')  // ✅ Matches /story-fragment
```

So you get:
- No topnav
- No footer
- No padding
- Full viewport

#### 3. Font Variables
```css
.toolbarLabel {
  font-family: var(--font-family-sans);  /* ✅ Use this */
}

.title {
  font-family: var(--font-family-display);  /* ✅ For headlines */
}
```

#### 4. Spacing (If Needed)
```css
.toolbar {
  gap: var(--space-4);    /* ✅ Consistent with rest of site */
  padding: var(--space-3);
}
```

### ❌ What You Shouldn't Use

- **Don't use utility classes** - You're already using CSS modules, stick with that
- **Don't override frameless styles** - They're already perfect for your use case
- **Don't hardcode brand colors** - Use the CSS variables

---

## Current `/story-fragment` CSS Review

### What's Good ✅

```css
/* StoryFragment.module.css - line 5 */
background-color: var(--brand-offwhite);  /* ✅ Using CSS variable */

/* Line 127 */
background-color: rgba(35, 31, 32, 0.95);  /* ✅ brand-black with alpha */

/* Line 148 */
color: var(--brand-offwhite);  /* ✅ Using CSS variable */
```

### What Could Be Better 🔶

```css
/* Line 162 */
background-color: var(--brand-offwhite);  /* ✅ Good */
color: var(--brand-black);                 /* ✅ Good */
border: 1px solid var(--brand-black);     /* ✅ Good */

/* Line 174 */
background-color: var(--brand-yellow);    /* ✅ Good */

/* Line 145-146 */
font-family: var(--font-family-sans);     /* ✅ Good */
```

Actually, you're **already using the system correctly!** 🎉

### Minor Improvements

```css
/* Current (line 127) */
background-color: rgba(35, 31, 32, 0.95);

/* Could be (more maintainable) */
background-color: color-mix(in srgb, var(--brand-black) 95%, transparent);
/* Or keep as-is, it's fine */
```

---

## Is It Clean or Messy?

### Verdict: **CLEAN** ✅

**Strengths:**
- ✅ **Consistent architecture** - Global foundation + component modules
- ✅ **Well-documented** - CSS variables have clear names
- ✅ **Scoped by default** - CSS Modules prevent collisions
- ✅ **Design system** - Brand tokens, spacing scale, typography
- ✅ **Frameless support** - Already handles full-screen experiences

**Minor Issues:**
- 🔶 Some hardcoded colors in RootLayout styles (could use more CSS vars)
- 🔶 A few utility classes overlap with component styles (minor)
- 🔶 No dark mode tokens (not needed yet)

**Overall Grade: A-**

This is **production-quality CSS architecture**. You can confidently build on top of it.

---

## Recommendations for `/story-fragment`

### 1. Keep Using CSS Variables
You're already doing this. Continue!

### 2. Stay in CSS Modules
Don't mix in utility classes from globals. Keep it modular.

### 3. Use Frameless Layout Feature
Already working. You get full viewport for free.

### 4. Consider Adding to Design System
If you create reusable patterns (like the guide system), you could:

**Option A:** Keep in `StoryFragment.module.css` (if only used here)
**Option B:** Extract to shared component (if reused)

For now, **Option A** is fine.

### 5. Toolbar Styling
Your toolbar is already consistent with the site's design language:
- Uses CSS variables for colors ✅
- Uses same font family ✅
- Matches brand aesthetic ✅

---

## Summary for Your Simplification

**You can proceed with confidence:**

1. **Global CSS is clean** - Use CSS variables throughout
2. **Frameless mode works** - You already get full viewport
3. **Your CSS is good** - Already following the patterns correctly
4. **No conflicts** - CSS Modules keep everything scoped

**For the static content model:**

```css
/* Just keep using what you have */
.workspace {
  width: 100vw;               /* ✅ Frameless gives you this */
  height: 100vh;
  background-color: var(--brand-offwhite);  /* ✅ Already using */
}

.image {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* Intrinsic dimensions from Sanity */
}
```

**No changes needed to the CSS architecture.** It's already clean and supports what you're building.

---

## Quick Reference: Available CSS Variables

### Colors
```css
--brand-black: #231f20
--brand-red: #FC555B
--brand-yellow: #FCDC4A
--brand-pink: #FB6DCB
--brand-blue: #A9ECD4
--brand-offwhite: #EAEADA
```

### Typography
```css
--font-family-sans: 'Parkinsans', ...
--font-family-display: 'Krana Fat Trial', ...
```

### Spacing (1 = 4px, 12 = 200px)
```css
--space-1 through --space-12
```

### Use them in your modules:
```css
background-color: var(--brand-yellow);
font-family: var(--font-family-sans);
padding: var(--space-4);
```

---

**Bottom line:** The CSS architecture is **clean, consistent, and ready to use**. No need to fight it or work around it. Just keep doing what you're doing! 🎯

