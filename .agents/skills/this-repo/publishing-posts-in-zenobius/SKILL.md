---
name: publishing-posts-in-zenobius
description: Use when publishing or scheduling posts in zenobi.us. Verifies stage behavior from code, updates frontmatter safely, and confirms visibility implications before merge.
---

# Publishing Posts in zenobi.us

## Purpose

Use this skill when changing a post from draft to published, or when deciding to use
`scheduled`.

This skill exists to prevent assumptions about how `stage` behaves.

## Ground Truth in This Repo

`stage` is defined in `content-collections.ts` as:

- `draft`
- `published`
- `scheduled`

Current runtime filtering is in `app/services/Content/selectors.ts`:

- In development: all stages are visible.
- Outside development: only `draft` is hidden.
- Meaning `published` and `scheduled` are both visible in non-dev environments.

There is currently no date-based publish scheduler in content selectors.

## When to Use Which Stage

- Use `draft` when the post must stay hidden in production.
- Use `published` when the post should be publicly visible now.
- Use `scheduled` only if you explicitly want it visible with current behavior, or after adding real scheduling logic.

If your intent is "visible later automatically", current code does not provide that.

## Required Workflow

1. Confirm target post file in `content/posts/`.
2. Read frontmatter and identify current `stage`.
3. If publishing now, set `stage: published`.
4. If setting `scheduled`, explicitly note that it is currently visible in production.
5. Run validation checks before claiming done:
   - `mise run lint`
   - `mise run typecheck`
6. Summarize the behavior impact in your handoff message.

## Safe Edit Rule

Only change the `stage` field unless asked otherwise.

Do not rewrite content, title, tags, date, or body unless explicitly requested.

## Handoff Template

When finishing, report:

- file changed
- old stage -> new stage
- verification command results
- visibility note:
  - `draft` hidden in prod
  - `published` visible in prod
  - `scheduled` visible in prod (with current code)
