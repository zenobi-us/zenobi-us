---
name: commit-prefix-by-path-zenobius
description: Use when composing Conventional Commit messages in this repo. Prioritizes commit prefixes by changed-file paths.
---

# Commit Prefix by Path (zenobi.us)

Pick the Conventional Commit prefix from changed files using this priority order:

1. `content/**/*` → `fix(content): ...`
2. `app/{area}/**/*` → `fix(app/{area}): ...`
3. `e2e/**/*` → `fix(tests): ...`
4. `.memory/**/*` → `chore(memory): ...`

If multiple paths are changed, use the highest-priority matching rule above.
