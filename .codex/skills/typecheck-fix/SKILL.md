---
name: typecheck-fix
description: Use when the user wants the project TypeScript check run via `npm run typecheck`, wants TypeScript compiler errors fixed, or asks to make the repo typecheck clean. This skill runs the repo script exactly, fixes reported errors iteratively, and reruns until the check passes or a real blocker remains.
---

# Typecheck Fix

Run the repository typecheck with `npm run typecheck`. Do not replace it with `tsc` directly unless the script is broken and that difference matters for debugging.

## Workflow

1. Confirm the repo exposes `npm run typecheck` in `package.json`.
2. Run `npm run typecheck`.
3. Read the compiler output and group failures by root cause before editing.
4. Fix errors with minimal code changes that preserve existing architecture and behavior.
5. Rerun `npm run typecheck`.
6. Repeat until the command passes or the remaining issue is blocked by missing requirements, broken generated code, or external state.

## Fixing Rules

- Prefer fixing the actual type mismatch over using `any`, `as unknown as`, or non-null assertions.
- Keep edits narrow. Do not refactor unrelated files just because the compiler touched them.
- Follow repo conventions for imports, path aliases, and component boundaries.
- Use `apply_patch` for manual file edits.
- Do not run lint, prettier, or unrelated tests unless the user asks.
- If a type error comes from a new change, fix that change first before touching shared abstractions.
- If multiple errors share one bad type definition, fix the definition and rerun before making more edits.

## Output

- If typecheck passes, report that `npm run typecheck` is clean.
- If it fails, report the main error groups and the files changed.
- If blocked, state the exact blocker and the failing command/result.
