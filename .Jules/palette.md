## 2025-05-14 - Pluralization in ARIA labels
**Learning:** Screen reader users benefit from grammatically correct announcements. "1 items" is a small but noticeable friction point.
**Action:** Always use conditional logic for pluralization in ARIA labels containing counts (e.g., `${count} ${count === 1 ? 'item' : 'items'}`).

## 2025-05-14 - PR Hygiene in Monorepos
**Learning:** Running `pnpm install` in some environments can trigger major lockfile version updates (e.g., v6 to v9) which clutter PRs and should be reverted unless intended.
**Action:** Always check `git status` before committing and restore unintended changes to `pnpm-lock.yaml` or build artifacts like `tsconfig.tsbuildinfo`.
