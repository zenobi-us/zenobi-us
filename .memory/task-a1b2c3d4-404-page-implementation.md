# Task: 404 Page Implementation

## Objective

Create a visually appealing 404 page using the purple/iris theme from the design system.

## Required Skills

Before starting, load these skills:
```
skill_use remix-static-routing
skill_use styling-react-with-tailwind
```

## Subtasks

- [ ] Create `app/routes/$/route.tsx` splat route (see remix-static-routing skill)
- [ ] Design 404 component with:
  - Large "404" heading in iris purple (`text-text-link`)
  - Friendly message
  - Navigation link back to home
  - Consistent with site animations (framer-motion)
- [ ] Style using `tv()` pattern from tailwind-variants (see styling-react-with-tailwind skill)
- [ ] Test manually by visiting non-existent route
- [ ] Add meta tags for 404 page

## Implementation Notes

### File Location
`app/routes/$/route.tsx`

### Key Tokens to Use (from styling-react-with-tailwind)
- `text-text-link` - main 404 text (iris purple accent)
- `text-text-strong` - emphasized text
- `text-text-muted` - secondary message text
- `bg-background-base` - page background
- `border-border-muted` - decorative elements

### Component Structure
```
Page
└── ErrorContainer (styled with tv())
    ├── 404 Heading
    ├── Message
    └── HomeLink (using Box with asChild pattern or Link component)
```

### Styling Pattern (from styling-react-with-tailwind)
Use Pattern 2: Base (single-element) or Pattern 1: Slots (multi-element)
- Always use `classnames()` utility to merge classes
- Use `VariantProps<typeof Styles>` for variant types
- Use semantic tokens, not raw colors

## Dependencies

- `~/components/ds/page/Page`
- `~/components/ds/box/Box` (for polymorphic link styling)
- `~/core/classnames` (for merging classes)
- `tailwind-variants`
- `framer-motion`
