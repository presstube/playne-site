# PLAYNE Brand Integration Summary

## Overview
Successfully integrated PLAYNE brand colors and fonts from the brand-spike project into the next-sanity-spike project, following the established CSS Modules architecture.

## What Was Added

### 1. Brand Colors (from brand-spike)
The following PLAYNE brand colors are now available as CSS custom properties:

```css
--brand-black: #231f20
--brand-red: #FC555B
--brand-yellow: #FCDC4A
--brand-pink: #FB6DCB
--brand-blue: #A9ECD4
--brand-offwhite: #EAEADA
```

### 2. Typography
- **Krana Fat Trial**: Display font for headings and branding (local font files)
- **Parkinsans**: Sans-serif font for body text (Google Fonts)

### 3. Font Files
Copied Krana Fat Trial font files to `/public/fonts/`:
- `KranaFatTrial-A.otf` (400 weight)
- `KranaFatTrial-B.otf` (700 weight)

### 4. CSS Utility Classes
Added comprehensive utility classes for easy brand application:

#### Typography
- `.font-display` - Krana Fat Trial display font
- `.font-sans` - Parkinsans sans-serif font

#### Background Colors
- `.bg-brand-black`, `.bg-brand-red`, `.bg-brand-yellow`
- `.bg-brand-pink`, `.bg-brand-blue`, `.bg-brand-offwhite`

#### Text Colors
- `.text-brand-black`, `.text-brand-red`, `.text-brand-yellow`
- `.text-brand-pink`, `.text-brand-blue`, `.text-brand-offwhite`

#### Border Colors
- `.border-brand-black`, `.border-brand-red`, `.border-brand-yellow`
- `.border-brand-pink`, `.border-brand-blue`, `.border-brand-offwhite`

#### Component Classes
- `.subtitle` - Styled subtitle component
- `.section-space` - Bottom margin for sections (200px)
- `.section-space-top` - Top margin for sections (200px)
- `.module-space` - Bottom margin for modules (64px)

### 5. Spacing Scale
Added consistent spacing scale using CSS custom properties:
- `--space-1` through `--space-12` (4px to 200px)

## How to Use

### In CSS Modules (Recommended)
```css
/* Component.module.css */
.title {
  font-family: var(--font-family-display);
  color: var(--brand-black);
  background-color: var(--brand-yellow);
}

.content {
  font-family: var(--font-family-sans);
  color: var(--brand-black);
  margin-bottom: var(--space-8);
}
```

### With Utility Classes
```jsx
// Component.tsx
<h1 className="font-display text-brand-black bg-brand-yellow">
  PLAYNE Title
</h1>
<p className="font-sans text-brand-black">
  Body content using Parkinsans
</p>
```

## Brand Color Accessibility

Based on the brand-spike project, these color combinations are recommended:

### Fully Accessible (A-level)
- Black background + Yellow text
- Black background + Blue text  
- Black background + Off-white text
- Off-white background + Black text
- Yellow background + Black text
- Blue background + Black text

### Large Text/Logos Only (B-level)
- Black background + Red/Pink text
- Pink background + any other color
- Red background + Black/Blue text
- And other combinations (see brand-spike/src/brand/colors.js)

## Architecture Compliance

This integration follows the established architecture guidelines:
- ✅ CSS custom properties in `globals.css`
- ✅ Utility classes for common patterns
- ✅ Existing components use CSS Modules (unchanged)
- ✅ Font loading optimized with `font-display: swap`
- ✅ Google Fonts preconnected for performance

## Next Steps

1. **Update Existing Components**: Apply brand colors to existing components like Topnav and HomePage
2. **Create Brand Components**: Build reusable components using the new brand system
3. **Test Accessibility**: Verify color contrast ratios meet accessibility standards
4. **Add Brand Assets**: Consider adding PLAYNE logos and other brand assets

## Files Modified

- `/src/app/globals.css` - Added brand colors, fonts, and utilities
- `/src/app/layout.tsx` - Added Google Fonts link for Parkinsans
- `/public/fonts/` - Added Krana Fat Trial font files

## Brand Assets Available

The brand-spike project contains additional assets that could be integrated:
- PLAYNE logos in multiple formats (SVG, PNG, PDF)
- Brand shapes and illustrations
- Color palette reference image
- Complete brand guidelines PDF

This integration provides a solid foundation for implementing the PLAYNE brand throughout the site while maintaining the existing CSS Modules architecture.
