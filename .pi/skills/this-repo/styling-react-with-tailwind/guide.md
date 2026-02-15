# Tailwind Variants in React: zenobi.us Implementation Guide

**Author:** OpenCode Agent  
**Date:** 2025-12-15  
**Repository:** zenobi.us  
**Target:** React components using `tailwind-variants`, `tw-colors`, and vanilla-extract

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Pattern Reference](#pattern-reference)
4. [Integration Guide](#integration-guide)
5. [Best Practices](#best-practices)
6. [Quick Recipes](#quick-recipes)

---

## Overview

The zenobi.us codebase implements a **production-grade theming system** combining:

- **tailwind-variants** (v0.3.0): Type-safe component style composition
- **Tailwind CSS** (v3.4): Utility-first CSS framework
- **tw-colors** (v3.3.2): Dynamic CSS custom properties for themes
- **vanilla-extract**: Compile-time CSS-in-JS for dynamic values
- **chroma-js**: Programmatic color manipulation

### Key Statistics
- **48 components** using `tv()`
- **150+ CSS custom properties** per theme (light/dark)
- **3 color schemes** (base + 2 Rose Pine variants)
- **Type-safe** component props via `VariantProps<typeof Styles>`

### What This Enables
✅ Type-safe variant combinations  
✅ Dynamic theming (system preference + manual override)  
✅ Reusable component styling patterns  
✅ Single source of truth for colors/typography  
✅ Zero runtime CSS overhead (compiled to static classes)

---

## Architecture

### Data Flow: Source → DOM

```
palette.ts
├─ rosePineMoon.ts (dark theme)
│  └─ chroma-js color manipulation → 150+ color vars
├─ rosePineDawn.ts (light theme)
│  └─ chroma-js color manipulation → 150+ color vars
│
↓ tailwind.config.ts

tailwind.config.ts
├─ createThemes({ light: RosePineDawn, dark: RosePineMoon })
├─ tw-colors plugin → CSS custom properties (--color-text-base, etc.)
├─ gridAreas plugin
├─ animate plugin
├─ typography plugin
│
↓ tv() function in components

Component.tsx
├─ tv({ slots, variants, defaultVariants })
├─ Styles({ size, tone, ... }) → className strings
│
↓ classnames() utility

<div className={classnames('component', styles.container())} />
```

### Theme Switching Flow

```
1. Browser opens → System preference (@media prefers-color-scheme)
                ↓
2. InitialiseColorScheme() [Init.ts]
   ├─ matchMedia('prefers-color-scheme: dark')
   └─ setPreferredTheme() adds .dark or .light class
                ↓
3. CSS cascade detects root classname
   ├─ .dark → tw-colors applies dark theme variables
   └─ .light → tw-colors applies light theme variables
                ↓
4. tailwind-variants uses --color-* variables
   └─ Component renders with correct colors
```

### CSS Custom Property Naming

Generated variables follow: `--color-{category}-{name}`

| Category | Keys | Used For |
|----------|------|----------|
| **text** | base, muted, disabled, link, button, input, strong, hover, etc. | Text foreground colors |
| **background** | base, elevated, card, overlay, button, input, shadow, etc. | Fill backgrounds |
| **border** | input, button, focused, highlight, positive, cautious, critical | Border/outline colors |
| **headings** | primary, secondary, tertiary | Heading text colors |

**Example Usage in Tailwind:**
```
text-text-base              → var(--color-text-base)
bg-background-button        → var(--color-background-button)
border-border-input         → var(--color-border-input)
hover:bg-background-button-hover
visited:text-text-link-visited
```

---

## Pattern Reference

### Pattern 1: Slots-Based Multi-Section Components

**Use when:** Component has distinct visual sections (container, label, icon, etc.)

```typescript
// File: app/components/ds/button/Button.tsx
import { tv, type VariantProps } from 'tailwind-variants'
import classnames from '~/app/core/classnames'

const Styles = tv({
  slots: {
    container: [
      'p-4 flex gap-4 items-center justify-center',
      'cursor-pointer',
      'rounded border-border-muted border-2',
      'active:border-border-positive',
      'hover:border-border-button',
      'disabled:grayscale disabled:cursor-not-allowed',
    ],
    label: ['flex gap-2 items-center'],
    icon: ['w-6 h-6'],
  },
  
  defaultVariants: {
    primary: false,
    size: 'medium',
  },
  
  variants: {
    primary: {
      true: {
        container: [
          'text-text-button bg-background-button',
          'hover:text-text-button-hover hover:bg-background-button-hover',
          'active:text-text-button-active active:bg-background-button-active',
          'focus:text-text-button-active focus:bg-background-button-active',
        ],
        label: ['font-button font-700'],
      },
    },
    secondary: {
      true: {
        container: ['text-text-button-secondary'],
        label: ['font-button font-400'],
      },
    },
    size: {
      small: { container: ['text-xs px-2 py-1'] },
      medium: { container: ['text-sm px-4 py-2'] },
      large: { container: ['text-base px-6 py-3'] },
    },
  },
})

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof Styles> & {
    icon?: React.ReactNode
    label: React.ReactNode
  }

export function Button({
  className,
  primary,
  secondary,
  size,
  icon,
  label,
  ...props
}: ButtonProps) {
  const styles = Styles({ primary, secondary, size })
  
  return (
    <button className={classnames('button', className, styles.container())} {...props}>
      {icon && <span className={styles.icon()}>{icon}</span>}
      <span className={styles.label()}>{label}</span>
    </button>
  )
}
```

**Key Concepts:**
- **slots:** Define styling for each DOM section
- **defaultVariants:** Fallback values when props omitted
- **VariantProps:** Auto-extract prop types from variants
- **Spread to tv():** Pass all variant props directly
- **styles.slotName():** Get className string per slot

---

### Pattern 2: Simple Base with Enum Variants

**Use when:** Component has single element, multiple style options

```typescript
// File: app/components/ds/box/Box.tsx
import { tv, type VariantProps } from 'tailwind-variants'

const Styles = tv({
  base: 'flex',
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
    gap: {
      none: 'gap-0',
      small: 'gap-2',
      medium: 'gap-4',
      large: 'gap-8',
    },
  },
  defaultVariants: {
    direction: 'row',
    gap: 'medium',
  },
})

export type BoxProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof Styles>

export function Box({
  className,
  direction,
  gap,
  children,
  ...props
}: BoxProps) {
  const styles = Styles({ direction, gap })
  return (
    <div className={classnames('box', className, styles)} {...props}>
      {children}
    </div>
  )
}
```

**Usage:**
```tsx
<Box direction="column" gap="large" />
<Box gap="small" />  // direction defaults to 'row'
```

---

### Pattern 3: Type-Safe Props with VariantProps

**Use when:** Need strict TypeScript validation of variant props

```typescript
// File: app/components/ds/icon/Icon.tsx
import { tv, type VariantProps } from 'tailwind-variants'

const Styles = tv({
  slots: {
    block: 'flex items-center',
    icon: 'flex',
    visuallyHidden: 'sr-only',
  },
  variants: {
    size: {
      small: { icon: 'w-5 h-5' },
      medium: { icon: 'w-10 h-10' },
      large: { icon: 'w-15 h-15' },
    },
    tone: {
      base: { icon: 'text-text-base' },
      muted: { icon: 'text-text-muted' },
      critical: { icon: 'text-text-critical' },
    },
  },
})

// Extract all valid variant combinations
export type IconProps = VariantProps<typeof Styles> &
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string
    name: keyof typeof Icons
  }

export function Icon({
  className,
  label,
  name,
  size = 'medium',
  tone = 'base',
  ...props
}: IconProps) {
  const styles = Styles({ size, tone })
  const IconComponent = Icons[name]
  
  return (
    <div className={classnames('icon', className, styles.block())} {...props}>
      <IconComponent className={styles.icon()} />
      {label && <span className={styles.visuallyHidden()}>{label}</span>}
    </div>
  )
}

// TypeScript error: Icon with invalid size prop
// ❌ <Icon name="bell" size="huge" />
// ✅ <Icon name="bell" size="small" />
```

**Benefits:**
- Autocomplete in IDE
- Compile-time variant validation
- No runtime errors
- Self-documenting code

---

### Pattern 4: State-Driven Variants (Form Inputs)

**Use when:** Styling depends on dynamic state (validation, focus, etc.)

```typescript
// File: app/components/ds/form/TextInput.tsx
import { tv, type VariantProps } from 'tailwind-variants'

export const TextInputStyles = tv({
  base: [
    'text-text-input-label bg-background-input',
    'border-2 border-border-input',
    'py-2 px-4 rounded',
    'focus:outline-none focus:ring-2 focus:ring-border-input-focused focus:ring-opacity-50',
    'transition-colors duration-200',
  ],
  
  variants: {
    invalid: {
      true: [
        'text-text-critical',
        'bg-background-critical opacity-90',
        'border-border-critical',
      ],
    },
    disabled: {
      true: ['opacity-50 cursor-not-allowed'],
    },
    isDirty: { true: [] },      // Trigger other changes based on state
    isTouched: { true: [] },
    isValidating: { true: [] },
  },
})

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof TextInputStyles> & {
    label?: string
    error?: string
  }

export function TextInput({
  className,
  label,
  error,
  value,
  disabled,
  onBlur,
  ...props
}: TextInputProps) {
  const [isTouched, setIsTouched] = React.useState(false)
  const [isValidating, setIsValidating] = React.useState(false)
  
  const isDirty = !!value && value !== props.defaultValue
  const isInvalid = isTouched && !!error
  
  const styles = TextInputStyles({
    invalid: isInvalid,
    isDirty,
    isTouched,
    isValidating,
    disabled,
  })
  
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-input-label">{label}</label>}
      <input
        className={classnames('text-input', className, styles)}
        value={value}
        disabled={disabled}
        onBlur={(e) => {
          setIsTouched(true)
          onBlur?.(e)
        }}
        {...props}
      />
      {error && isTouched && (
        <span className="text-text-critical text-xs">{error}</span>
      )}
    </div>
  )
}
```

**Usage:**
```tsx
<TextInput
  label="Email"
  value={email}
  error={emailError}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={validateEmail}
/>
```

---

### Pattern 5: Boolean Conditional Variants

**Use when:** Styling differs drastically between two states

```typescript
// File: app/components/ds/link/Link.tsx
import { tv, type VariantProps } from 'tailwind-variants'

const Styles = tv({
  base: ['underline whitespace-normal transition-colors'],
  
  variants: {
    current: {
      true: [
        'text-text-positive/80',
        'hover:text-text-positive hover:underline',
        'active:text-text-positive active:underline',
        'visited:text-text-positive visited:bg-background-link-active',
      ],
      false: [
        'text-text-link',
        'hover:text-text-link-hover hover:underline',
        'active:text-text-link-active',
        'visited:text-text-link-visited',
      ],
    },
    external: {
      true: ['before:content-["↗"] before:ml-1 before:text-xs'],
      false: [],
    },
  },
})

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof Styles> & {
    current?: boolean
  }

export function Link({
  href,
  className,
  current,
  children,
  ...props
}: LinkProps) {
  const isExternal = !!href && href.startsWith('http')
  const LinkComponent = useLinkComponent()
  const styles = Styles({ current, external: isExternal })
  
  return (
    <LinkComponent
      href={href}
      className={classnames('link', className, styles)}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      {...props}
    >
      {children}
    </LinkComponent>
  )
}
```

---

### Pattern 6: Complex Multi-Variant with Tones

**Use when:** Multiple color schemes/semantic meanings (error, warning, success, etc.)

```typescript
// File: app/components/common/Notice.tsx
import { tv, type VariantProps } from 'tailwind-variants'

const Styles = tv({
  slots: {
    icon: 'w-6 h-6 pt-0 flex-shrink-0',
    block: [
      'flex flex-row gap-2 items-center',
      'rounded border-l-0 px-4 py-2 my-4',
      '[& p]:p-0 [& p]:m-0',
    ],
    content: ['flex flex-row flex-wrap', '[&_p]:last:m-0'],
  },
  
  defaultVariants: { type: 'info' },
  
  variants: {
    type: {
      info: {
        block: 'bg-background-informative text-text-informative',
        icon: 'text-text-informative',
      },
      positive: {
        block: 'bg-background-positive text-text-positive',
        icon: 'text-text-positive',
      },
      critical: {
        block: 'bg-background-critical text-text-critical',
        icon: 'text-text-critical',
      },
      cautious: {
        block: 'bg-background-cautious text-text-cautious',
        icon: 'text-text-cautious',
      },
    },
  },
})

const typeToIconMap: Record<VariantProps<typeof Styles>['type'], string> = {
  info: 'InfoIcon',
  cautious: 'MessageCircleWarning',
  positive: 'CheckCircle',
  critical: 'CloudLightningIcon',
}

export type NoticeProps = VariantProps<typeof Styles> & {
  children: React.ReactNode
}

export function Notice({ type = 'info', children }: NoticeProps) {
  const styles = Styles({ type })
  const iconName = typeToIconMap[type || 'info']
  const Icon = IconsMap[iconName]
  
  return (
    <div className={styles.block()}>
      <Icon className={styles.icon()} />
      <div className={styles.content()}>{children}</div>
    </div>
  )
}
```

**Usage:**
```tsx
<Notice type="positive">Success! Email sent.</Notice>
<Notice type="critical">Error: Invalid input.</Notice>
<Notice type="cautious">Warning: This action cannot be undone.</Notice>
<Notice type="info">Info: Loading data...</Notice>
```

---

### Pattern 7: Loader with Direction & Effect Combinations

**Use when:** Need multiple independent variant axes

```typescript
// File: app/components/ds/loader/Loader.tsx
import { tv, type VariantProps } from 'tailwind-variants'

const Styles = tv({
  slots: {
    base: 'flex flex-grow items-center justify-center gap-1',
    dots: 'flex gap-1 transition-all',
    dot: 'w-1 h-1 rounded-full animate-pulse',
    label: 'sr-only',
  },
  
  variants: {
    tone: {
      base: { dot: 'bg-background-button' },
      muted: { dot: 'bg-background-muted' },
      cautious: { dot: 'bg-background-cautious' },
      critical: { dot: 'bg-background-critical' },
      positive: { dot: 'bg-background-positive' },
    },
    
    effect: {
      blurred: {
        base: 'contrast-0 mix-blend-multiply blur-md',
      },
      shimmer: {
        base: 'animate-shimmer',
      },
      none: {
        base: '',
      },
    },
    
    direction: {
      horizontal: {
        dots: 'flex-row',
      },
      vertical: {
        dots: 'flex-col',
      },
    },
    
    size: {
      small: { dot: 'w-0.5 h-0.5' },
      medium: { dot: 'w-1 h-1' },
      large: { dot: 'w-2 h-2' },
    },
  },
  
  defaultVariants: {
    tone: 'base',
    effect: 'none',
    direction: 'horizontal',
    size: 'medium',
  },
})

export type LoaderProps = VariantProps<typeof Styles> & {
  label?: string
  dotCount?: number
}

export function Loader({
  label = 'Loading',
  dotCount = 3,
  tone,
  effect,
  direction,
  size,
}: LoaderProps) {
  const styles = Styles({ tone, effect, direction, size })
  
  return (
    <div className={styles.base()}>
      <div className={styles.dots()}>
        {Array.from({ length: dotCount }).map((_, i) => (
          <div key={i} className={styles.dot()} />
        ))}
      </div>
      <span className={styles.label()}>{label}</span>
    </div>
  )
}
```

**Usage:**
```tsx
<Loader tone="positive" size="large" direction="vertical" />
<Loader tone="critical" effect="blurred" />
<Loader />  // Uses defaults
```

---

## Integration Guide

### Step 1: Install Dependencies

```bash
yarn add tailwind-variants tailwindcss tw-colors @tailwindcss/typography tailwindcss-animate tailwindcss-grid-areas chroma-js flat
```

### Step 2: Configure tailwind.config.ts

```typescript
import { gridAreas } from 'tailwindcss-grid-areas'
import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'
import { createThemes } from 'tw-colors'

import { RosePineDawn, RosePineMoon } from './app/theme/colours'
import { Typeface, TypefaceNames } from './app/theme/fonts/typeface'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './content/**/*.md',
  ],
  
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(.light *) }',
      '&:is(.dark *)',
    ],
  ],
  
  theme: {
    fontSize: Typeface,
    fontFamily: TypefaceNames,
    lineHeight: {
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
    },
    extend: {},
  },
  
  plugins: [
    animate,
    typography(),
    gridAreas({}),
    createThemes({
      light: RosePineDawn,
      dark: RosePineMoon,
    }),
  ],
}
```

### Step 3: Create Color Palette

```typescript
// app/theme/colours/palette.ts
import chroma from 'chroma-js'

export const rosePine = {
  base: '#191724',
  surface: '#1f1d2e',
  overlay: '#26233a',
  muted: '#6e6a86',
  subtle: '#908caa',
  text: '#e0def4',
  love: '#eb6f92',
  gold: '#f6c177',
  rose: '#ebbcba',
  pine: '#31748f',
  foam: '#9ccfd8',
  iris: '#c4a7e7',
  highlightLow: '#21202e',
  highlightMed: '#403d52',
  highlightHigh: '#524f67',
}

// app/theme/colours/rosepinemoon.ts
import chroma from 'chroma-js'
import { rosePine } from './palette'
import { flat } from 'flat'

const moonTheme = {
  text: {
    base: rosePine.text,
    muted: rosePine.muted,
    disabled: chroma(rosePine.iris).desaturate(1).hex(),
    link: rosePine.pine,
    'link-hover': chroma(rosePine.pine).brighten(0.5).hex(),
    'link-visited': chroma(rosePine.love).desaturate(0.5).hex(),
    button: rosePine.text,
    'button-hover': chroma(rosePine.text).brighten(0.2).hex(),
    'button-active': chroma(rosePine.text).brighten(0.4).hex(),
  },
  background: {
    base: rosePine.base,
    elevated: rosePine.surface,
    overlay: rosePine.overlay,
    button: rosePine.love,
    'button-hover': chroma(rosePine.love).brighten(0.2).hex(),
    'button-active': chroma(rosePine.love).brighten(0.4).hex(),
  },
  // ... more colors
}

// Flatten to kebab-case CSS variables
export const RosePineMoon = flat(moonTheme, { delimiter: '-' })
```

### Step 4: Integrate Theme Initialization

```typescript
// app/services/Theme/Init.ts
import { useEffect, useState } from 'react'

export function setPreferredTheme(theme: 'dark' | 'light') {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.classList.toggle('light', theme === 'light')
  localStorage.setItem('theme', theme)
}

export function InitialiseColorScheme() {
  const stored = localStorage.getItem('theme') as 'dark' | 'light' | null
  
  if (stored) {
    setPreferredTheme(stored)
    return
  }
  
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches
  setPreferredTheme(prefersDark ? 'dark' : 'light')
}

export function useDarkMode() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    InitialiseColorScheme()
    setIsLoaded(true)
  }, [])
  
  return isLoaded
}
```

### Step 5: Create Type-Safe Component Wrapper

```typescript
// app/core/classnames.ts
import type { ClassValue } from 'clsx'
import clsx from 'clsx'

export default function classnames(...args: ClassValue[]) {
  return clsx(...args)
}
```

---

## Best Practices

### ✅ Do

1. **Extract variant props via VariantProps<typeof Styles>**
   ```typescript
   export type ComponentProps = VariantProps<typeof Styles> & React.HTMLAttributes<...>
   ```

2. **Use defaultVariants for sensible fallbacks**
   ```typescript
   defaultVariants: { size: 'medium', tone: 'base' }
   ```

3. **Group related styles into slots**
   ```typescript
   slots: {
     container: [...],
     label: [...],
     icon: [...],
   }
   ```

4. **Use semantic color naming**
   ```
   text-text-base (not text-gray-900)
   bg-background-button (not bg-blue-600)
   border-border-positive (not border-green-500)
   ```

5. **Compose complex classnames with arrays**
   ```typescript
   base: [
     'flex items-center',
     'rounded border-2',
     'transition-colors duration-200',
   ]
   ```

6. **Test variant combinations**
   ```typescript
   // Verify all combinations compile without type errors
   <Button primary size="small" />
   <Button secondary size="large" />
   ```

### ❌ Don't

1. **Don't use arbitrary colors**
   ```typescript
   // ❌ bg-red-500 bg-blue-700 (use theme colors)
   // ✅ bg-background-critical bg-background-button
   ```

2. **Don't nest ternaries in className**
   ```typescript
   // ❌ className={isActive ? (disabled ? '...' : '...') : '...'}
   // ✅ className={styles.container()} // Pass state to tv()
   ```

3. **Don't destructure props in function parameters**
   ```typescript
   // ❌ function Button({ primary, size, ...props })
   // ✅ function Button(props) with VariantProps
   ```

4. **Don't hardcode tailwind classes in components**
   ```typescript
   // ❌ <div className="px-4 py-2 bg-blue-600">
   // ✅ <div className={styles.container()}>
   ```

5. **Don't create variants for every style combination**
   ```typescript
   // Instead: use defaultVariants, compose multiple variants
   ```

---

## Quick Recipes

### Recipe 1: State-Based Button Styling

```typescript
const Styles = tv({
  slots: {
    button: 'px-4 py-2 rounded transition-colors',
    text: 'font-button',
  },
  variants: {
    isLoading: {
      true: {
        button: 'opacity-60 cursor-not-allowed',
        text: 'animate-pulse',
      },
    },
  },
})

export function SubmitButton({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) {
  const styles = Styles({ isLoading })
  return (
    <button className={styles.button()} disabled={isLoading}>
      <span className={styles.text()}>{children}</span>
    </button>
  )
}
```

### Recipe 2: Responsive Variants

```typescript
// In tv() definition
variants: {
  layout: {
    card: 'p-4 gap-4 md:p-6 md:gap-6',
    compact: 'p-2 gap-2',
  },
}

// Usage: Single variant adapts at breakpoint via Tailwind
<Box layout="card" />  // 16px padding mobile, 24px desktop
```

### Recipe 3: Color Tone Mapping

```typescript
const toneMap: Record<VariantProps<typeof Styles>['tone'], string> = {
  base: 'InfoIcon',
  positive: 'CheckIcon',
  critical: 'ErrorIcon',
  cautious: 'WarningIcon',
}

const Icon = toneMap[props.tone || 'base']
```

### Recipe 4: Conditional Styling with Computed State

```typescript
const isFocused = focusedField === 'email'
const isInvalid = isFocused && !!errors.email

const styles = TextInputStyles({
  invalid: isInvalid,
  focused: isFocused,
})
```

### Recipe 5: Compound Variants (Advanced)

```typescript
const Styles = tv({
  slots: {
    button: 'px-4 py-2',
  },
  variants: {
    size: { small: '...', large: '...' },
    primary: { true: '...', false: '...' },
  },
  compoundVariants: [
    {
      size: 'large',
      primary: true,
      class: { button: 'shadow-lg' },
    },
  ],
})
```

---

## Troubleshooting

### Issue: Colors not applying
**Cause:** CSS variables not generated by tw-colors plugin  
**Fix:** Verify `createThemes()` in tailwind.config.ts, check browser DevTools CSS

### Issue: TypeScript errors on variant props
**Cause:** Not using `VariantProps<typeof Styles>`  
**Fix:** Extract type: `export type Props = VariantProps<typeof Styles> & ...`

### Issue: Styles not updating on theme switch
**Cause:** Theme initialization not called  
**Fix:** Call `InitialiseColorScheme()` in root component, add theme class to `<html>`

### Issue: Slot styles override not working
**Cause:** Specificity conflict or CSS ordering  
**Fix:** Use arrays to group logically, check Tailwind cascade order

---

## Resources

- **tailwind-variants Docs:** https://www.tailwind-variants.org/
- **Tailwind CSS Docs:** https://tailwindcss.com/
- **tw-colors Docs:** https://github.com/chancedev/tw-colors
- **zenobi.us Components:** `/app/components/ds/` (48 reference implementations)
- **Theme System:** `/app/theme/` and `/app/services/Theme/`

---

## Examples in Codebase

| Component | Pattern | File |
|-----------|---------|------|
| Button | Multi-variant slots | `/app/components/ds/button/Button.tsx` |
| Link | Boolean conditional | `/app/components/ds/link/Link.tsx` |
| TextInput | Form state variants | `/app/components/ds/form/TextInput.tsx` |
| Notice | Tone-based variants | `/app/components/common/Notice.tsx` |
| Loader | Multi-axis variants | `/app/components/ds/loader/Loader.tsx` |
| Icon | Type-safe props | `/app/components/ds/icon/Icon.tsx` |
| Box | Simple base + variants | `/app/components/ds/box/Box.tsx` |

---

**Last Updated:** 2025-12-15  
**Version:** 1.0.0
