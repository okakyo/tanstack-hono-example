# Compatibility Export Layer Sunset Plan

## Purpose

This document defines how to remove legacy compatibility exports under `src/usecases/*` and `src/repositories/*` after the feature-based migration.

## Current Policy

- Feature implementations live under `src/features/<feature>/application/usecases` and `src/features/<feature>/infrastructure/repositories`.
- Legacy paths under `src/usecases/*` and `src/repositories/*` are compatibility-only re-export layers.
- New code must not add business logic to legacy compatibility files.

## Scope

This plan applies to these migrated features:

- `material`
- `project`
- `task`
- `company`
- `document`
- `member`
- `member-role`
- `invite-status`
- `document-status`
- `company-plan`
- `tag`
- `user`
- `accounting`

## Phase 1: Freeze

- Keep compatibility files, but allow only `export * from ...` and `export { ... } from ...` forms.
- Reject PRs that add runtime logic to legacy files.
- Keep feature-local tests green with `pnpm --filter @repo/main-api check-types`.

Exit criteria:

- No legacy file in scope contains `import` statements for business logic.
- Feature folders are the only source of usecase/repository implementations.

## Phase 2: Consumer Migration

- Update internal imports to feature paths in small batches.
- Track unresolved imports with CI grep checks.

Recommended grep checks:

```sh
grep -R "@/usecases/\(member\|member-role\|invite-status\|document-status\|company-plan\|tag\|user\|accounting\)" apps/main-api/src
grep -R "@/repositories/\(member\|member-role\|invite-status\|document-status\|company-plan\|tag\|user\|accounting\)" apps/main-api/src
```

Exit criteria:

- No production code imports legacy paths for migrated features.
- Only temporary tests or migration scripts may reference compatibility paths.

## Phase 3: Removal

- Delete compatibility files feature-by-feature.
- After each deletion batch, run typecheck and tests.
- Keep deletion PRs narrow (one feature group per PR).

Exit criteria:

- `src/usecases/*` and `src/repositories/*` no longer contain compatibility files for migrated features.
- `app.module.ts`, `types/env.ts`, and feature modules still compile without path regressions.

## Operational Notes

- Prefer non-breaking rollout: migrate imports first, remove compatibility files last.
- If a rollback is needed, restore only the affected compatibility re-export files.
- Keep this document updated when additional features complete migration.
