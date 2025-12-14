# Agent Guidelines for zenobi.us

## Build & Test Commands

```bash
mise run build          # Build site (depends: content, typecheck)
mise run typecheck      # Type checking: tsc -p ./tsconfig.app.json --noEmit --incremental
mise run lint           # Spell check markdown: cspell-cli lint ./content/**/*.md
mise run dev            # Start dev server
mise run e2e            # Run e2e tests
```

For single tests: Use Jest directly via `yarn jest [pattern]` (test files use `.spec.ts/.spec.tsx`)

## Code Style

**Imports:** Group in order: builtin/external → parent/internal → sibling → index (use `~/**` for internal paths, one blank line between groups)

**Formatting:** Single quotes, semicolons, 80-char line width, single attribute per line (Prettier)

**Naming:** PascalCase for components/types, camelCase for functions/variables, no destructuring in function parameters (use `props.x` instead)

**Types:** Strict TypeScript (es2020 target), no prop-types, explicit typing required

**Exports:** Named exports by default (no default exports except in: stories, config files, route files, `*.d.ts`, `app/**/*.tsx`)

**Rules:** 
- No nested ternaries
- No array/object destructuring in function parameters
- Curly braces required
- React hooks linting enforced
