# UI Component Consolidation Plan

## Goal
Simplify the component library by consolidating Button/LinkButton into a single Button, and Card/ActionCard/ContentCard into a single Card, while keeping EventCard and DonationCard as standalone specialized components.

---

## Current State Analysis

### Buttons (2 components)
1. **`Button`** - Standard `<button>` with variants (primary, secondary, hero, submit, danger), sizes, loading states
2. **`LinkButton`** - Link styled as button with variants, sizes, external link support

### Cards (5 components)
1. **`Card`** - Base container (simple wrapper with variants)
2. **`ContentCard`** - Extends Card with title + description + icon + alignment
3. **`ActionCard`** - Extends ContentCard with CTA button/link
4. **`EventCard`** - Extends Card for events (date, time, location, type)
5. **`DonationCard`** - Extends Card for donations (amount, benefits list, donate button)

### Current Usage
- **HomePage**: ActionCard, LinkButton
- **ProgramsPage**: ContentCard
- **EventsPage**: EventCard, LinkButton
- **SupportPage**: DonationCard
- **components page** (graveyard): All of them

---

## Consolidation Strategy

### Components to DELETE (3)
```
src/components/LinkButton/           → Merged into Button
src/components/ActionCard/           → Replaced by new Card with cta prop
src/components/ContentCard/          → Replaced by new Card with title/body props
```

### Components to UPDATE (2)
```
src/components/Button/     → Replace with new consolidated implementation
src/components/Card/       → Replace with new flexible implementation
```

### Components to KEEP (2)
```
src/components/EventCard/    → Make standalone (remove Card dependency)
src/components/DonationCard/ → Make standalone (remove Card dependency, use new Button)
```

**Result:** 4 total components, all standalone, no inheritance.

---

## Phase 1: Create New Consolidated Components

### A. New `Button` Component

**Goal:** Simple, color-configurable button that handles both buttons and links

**Props:**
```typescript
interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  href?: string          // If href provided, render as Link
  external?: boolean     // For external links
  color?: string         // Brand color prop (e.g., 'red', 'yellow', 'blue', 'black')
  variant?: 'filled' | 'outlined'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}
```

**Implementation:**
- Single component that handles both `<button>` and `<Link>` based on presence of `href`
- If `href` exists:
  - If `external=true`: render `<a>` with `target="_blank"` and `rel="noopener noreferrer"`
  - Otherwise: render Next.js `<Link>`
- If no `href`: render `<button>` with `onClick`
- Color prop maps to brand colors (`--brand-red`, `--brand-yellow`, `--brand-blue`, `--brand-black`)
- Variant: `filled` (solid background) or `outlined` (border only)
- Remove: loading state, hero/submit/danger variants (simplify)

**CSS Variables:**
```css
.button {
  /* Base styles */
}

.button[data-color="red"] { --btn-color: var(--brand-red); }
.button[data-color="yellow"] { --btn-color: var(--brand-yellow); }
.button[data-color="blue"] { --btn-color: var(--brand-blue); }
.button[data-color="black"] { --btn-color: var(--brand-black); }

.filled { background-color: var(--btn-color); }
.outlined { border: 2px solid var(--btn-color); }
```

---

### B. New `Card` Component

**Goal:** Flexible card with optional title, body, and CTA

**Props:**
```typescript
interface CardProps {
  title?: string
  body?: string | ReactNode
  cta?: {
    text: string
    onClick?: () => void
    href?: string
    external?: boolean
    color?: string
  }
  variant?: 'default' | 'bordered' | 'accent'
  children?: ReactNode  // For custom content (overrides title/body if provided)
  className?: string
}
```

**Implementation:**
- If `children` provided, render that (full custom layout)
- Otherwise, render structured layout:
  - Render `title` only if provided
  - Render `body` only if provided
  - Render CTA button only if `cta` prop provided (uses new Button component)
- Variants:
  - `default`: Basic styling
  - `bordered`: With border
  - `accent`: With accent color border
- Flexible and composable

**Structure:**
```jsx
<div className={styles.card}>
  {children ? (
    children
  ) : (
    <>
      {title && <h3 className={styles.title}>{title}</h3>}
      {body && <div className={styles.body}>{body}</div>}
      {cta && (
        <Button 
          href={cta.href}
          onClick={cta.onClick}
          external={cta.external}
          color={cta.color}
        >
          {cta.text}
        </Button>
      )}
    </>
  )}
</div>
```

---

### C. Update `EventCard` - Make Standalone

**Current State:** Wraps `Card` component

**New State:** Standalone component with own structure and styles

**Changes:**
- Remove `import Card from '../Card/Card'`
- Create own wrapper div with `className={styles.eventCard}`
- Keep all existing props and structure
- Own complete styling (no inheritance)

---

### D. Update `DonationCard` - Make Standalone

**Current State:** Wraps `Card` component, uses `Button`

**New State:** Standalone component with own structure, uses new `Button`

**Changes:**
- Remove `import Card from '../Card/Card'`
- Update `import Button` to use new consolidated Button
- Create own wrapper div with `className={styles.donationCard}`
- Keep all existing props and structure
- Own complete styling (no inheritance)

---

## Phase 2: Update Usage Sites

### Files that need updates:

#### 1. `src/app/HomePage/HomePage.tsx`
**Changes:**
- Replace `ActionCard` with new `Card` (with `title`, `body`, `cta` props)
- Replace `LinkButton` with new `Button` (with `href`)

**Before:**
```typescript
<ActionCard 
  title="Join Us" 
  description="Get involved" 
  actionText="Sign Up" 
  actionHref="/join" 
/>
<LinkButton href="/get-involved">Get Involved</LinkButton>
```

**After:**
```typescript
<Card 
  title="Join Us" 
  body="Get involved" 
  cta={{ text: "Sign Up", href: "/join" }} 
/>
<Button href="/get-involved">Get Involved</Button>
```

---

#### 2. `src/app/ProgramsPage/ProgramsPage.tsx`
**Changes:**
- Replace `ContentCard` with new `Card` (with `title`, `body` props)

**Before:**
```typescript
<ContentCard 
  title="Programs" 
  description="Learn about our programs" 
/>
```

**After:**
```typescript
<Card 
  title="Programs" 
  body="Learn about our programs" 
/>
```

---

#### 3. `src/app/EventsPage/EventsPage.tsx`
**Changes:**
- Replace `LinkButton` with new `Button` (with `href`)
- `EventCard` stays the same ✅

**Before:**
```typescript
<LinkButton href="/events">View All Events</LinkButton>
```

**After:**
```typescript
<Button href="/events">View All Events</Button>
```

---

#### 4. `src/app/SupportPage/SupportPage.tsx`
**Changes:**
- `DonationCard` stays the same ✅ (just uses new Button internally)

---

#### 5. `src/app/components/page.tsx` (graveyard)
**Changes:**
- Remove: LinkButton, ActionCard, ContentCard from imports and JSX
- Update: Button examples to show color variants
- Update: Card examples to show variations (with/without title, body, cta)
- Keep: EventCard, DonationCard examples

**New Graveyard Structure:**
```jsx
{/* Buttons */}
<section className={styles.graveyardSection}>
  <div className={styles.examples}>
    <div className={styles.example}>
      <Button onClick={() => console.log('clicked')}>Default Button</Button>
      <p className={styles.label}>Button - Default</p>
    </div>
    <div className={styles.example}>
      <Button color="red" onClick={() => console.log('clicked')}>Red Button</Button>
      <p className={styles.label}>Button - Red</p>
    </div>
    <div className={styles.example}>
      <Button color="yellow" href="/test">Yellow Link</Button>
      <p className={styles.label}>Button - Yellow Link</p>
    </div>
    <div className={styles.example}>
      <Button color="blue" variant="outlined">Blue Outlined</Button>
      <p className={styles.label}>Button - Outlined</p>
    </div>
  </div>
</section>

{/* Cards */}
<section className={styles.graveyardSection}>
  <div className={styles.cardGrid}>
    <div className={styles.example}>
      <Card title="Basic Card" body="Simple card with title and body" />
      <p className={styles.label}>Card - Title + Body</p>
    </div>
    <div className={styles.example}>
      <Card 
        title="Card with CTA" 
        body="Card with button" 
        cta={{ text: "Learn More", href: "/about" }}
      />
      <p className={styles.label}>Card - With CTA</p>
    </div>
    <div className={styles.example}>
      <Card variant="bordered" title="Bordered Card" />
      <p className={styles.label}>Card - Bordered</p>
    </div>
    <div className={styles.example}>
      <Card variant="accent">
        <h3>Custom Content</h3>
        <p>Using children prop for custom layout</p>
      </Card>
      <p className={styles.label}>Card - Custom</p>
    </div>
  </div>
</section>

{/* Specialized Cards */}
<section className={styles.graveyardSection}>
  <div className={styles.cardGrid}>
    <div className={styles.example}>
      <EventCard
        title="Workshop: Financial Literacy"
        date="March 15, 2025"
        location="PLAYNE Center"
        description="Learn essential money management skills"
      />
      <p className={styles.label}>EventCard</p>
    </div>
    <div className={styles.example}>
      <DonationCard
        amount="$50"
        title="Monthly Support"
        description="Support one student for a month"
        onDonate={(amt) => console.log(`${amt} selected`)}
      />
      <p className={styles.label}>DonationCard</p>
    </div>
  </div>
</section>
```

---

## Phase 3: Implementation Order

### Step 1: Create New Components
1. Implement new `Button` component (src/components/Button/)
2. Implement new `Card` component (src/components/Card/)
3. Test in isolation

### Step 2: Update Specialized Cards
1. Update `EventCard` to be standalone
2. Update `DonationCard` to use new Button and be standalone
3. Test both components

### Step 3: Update Usage Sites
1. Update `HomePage`
2. Update `ProgramsPage`
3. Update `EventsPage`
4. Update `components` page graveyard
5. Test all pages

### Step 4: Delete Old Components
1. Delete `src/components/LinkButton/`
2. Delete `src/components/ActionCard/`
3. Delete `src/components/ContentCard/`
4. Run linter to catch any missed imports

### Step 5: Final Validation
1. Test all pages render correctly
2. Verify all CTAs work (clicks, links)
3. Check responsive behavior
4. Validate TypeScript types
5. Run full linter check

---

## Benefits

✅ **Simpler API** - Fewer components to learn and maintain  
✅ **Single Button** - Handles both button and link cases  
✅ **Flexible Card** - Can be simple or complex based on props  
✅ **Specialized Cards Stay** - EventCard and DonationCard keep their domain-specific features  
✅ **No Inheritance** - All components are standalone, no complex dependency chains  
✅ **Consistent Styling** - Unified approach to colors and variants  
✅ **Less Code** - Removing 3 components, consolidating logic  

---

## Risks & Mitigation

⚠️ **Breaking Changes** - Multiple pages need updates  
✅ **Mitigation:** Update one page at a time, test thoroughly

⚠️ **Props Migration** - Different prop names between old/new  
✅ **Mitigation:** Document migration examples clearly (see above)

⚠️ **Lost Features** - Removing loading state, some variants  
✅ **Mitigation:** Kept essential features, can add back if needed

⚠️ **Styling Differences** - New components may look slightly different  
✅ **Mitigation:** Match existing brand styles, test visually

---

## Success Criteria

- [ ] New Button component created and tested
- [ ] New Card component created and tested
- [ ] EventCard made standalone
- [ ] DonationCard made standalone
- [ ] HomePage updated and tested
- [ ] ProgramsPage updated and tested
- [ ] EventsPage updated and tested
- [ ] components page graveyard updated
- [ ] Old components deleted (LinkButton, ActionCard, ContentCard)
- [ ] No linter errors
- [ ] All pages render correctly
- [ ] All CTAs functional

---

## Timeline Estimate

- **Phase 1 (Create New Components):** 2-3 hours
- **Phase 2 (Update Usage Sites):** 1-2 hours
- **Phase 3 (Cleanup & Testing):** 1 hour

**Total:** 4-6 hours

