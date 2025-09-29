# Concrete Components

This project favors a small, purposeful set of brand-first components. Two components are the foundation of the PLAYNE visual language; everything else is supporting kit.

## Brand-first components

### BrandHero
Location: `src/components/BrandHero/`

- Purpose: Display the raw PLAYNE logo at prominent scale with zero chrome.
- Behavior: Scales to 50% of its container width by default; aspect ratio preserved.
- Typical placement: Standalone hero pages, brand demos, or top-of-page emphasis.

Props: none

Usage:
```tsx
<BrandHero />
```

---

### Headline
Location: `src/components/Headline/`

- Purpose: Canonical headline renderer enforcing PLAYNE type rules.
- Case rules: `all-caps` up to 8 words, `title-case` up to 18 words.
- Typography: regular weight; tracking −0.01em; kerning default.
- Leading: all-caps 0.88 (−12%); title-case 1.12 (+12%).
- Alignment: `left` or `center`.
- Colors: explicit `fg` and `bg`; optional `borderColor` (rounded, 1px).

Props:
- `text: string`
- `caseType: 'all-caps' | 'title-case'`
- `align?: 'left' | 'center'` (default: `center`)
- `fg?: string` (default: brand black)
- `bg?: string` (default: transparent)
- `borderColor?: string` (optional)
- `as?: 'h1' | 'h2' | 'div'` (default: `h1`)

Usage:
```tsx
<Headline
  text="Education For The Real World"
  caseType="title-case"
  align="left"
  fg="var(--brand-black)"
  bg="var(--brand-blue)"
  borderColor="rgba(35,31,32,0.12)"
/> 
```

---

## Supporting kit (starter set)

These components exist to speed up page assembly. They intentionally take a back seat to the brand-first primitives above and can be swapped, refactored, or removed as needs evolve.

- PageHero (`src/components/PageHero/`): simple page-level hero wrapper.
- PageSection (`src/components/PageSection/`): padded/rounded section container.
- Cards (`src/components/Card/`, `ContentCard/`, `ActionCard/`, `DonationCard/`, `EventCard/`): basic content grouping and CTAs.
- Buttons (`src/components/Button/`, `LinkButton/`): consistent actions and links.
- Form elements (`FormField/`, `TextInput/`, `TextArea/`, `Select/`, `FormRow/`): minimal, accessible inputs.

Notes:
- All components use CSS Modules and co-location.
- Prefer `Headline` and `BrandHero` for brand expression; compose other elements around them.

---

Last updated: September 2025

