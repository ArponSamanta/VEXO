## 2025-05-15 - Nested Interactive Elements Accessibility
**Learning:** Nesting interactive elements like buttons inside an anchor (`Link`) is invalid HTML and prevents screen readers from correctly identifying and interacting with the inner elements. It also breaks the expected focus flow for keyboard users.
**Action:** When a design requires buttons to overlap an interactive area (like a product card image), use a shared `relative` parent container and place the `Link` and the `buttons` as siblings. Use absolute positioning to place the buttons over the image and `group-focus-within` to ensure they are visible when receiving keyboard focus.

## 2025-05-15 - Lockfile Version Upgrades
**Learning:** Running `pnpm install` in this environment may trigger an unintentional upgrade of the `pnpm-lock.yaml` version (e.g., from v6 to v9), which should not be bundled with unrelated UX changes.
**Action:** Always check `git status` before submitting and use `git restore` to revert any unintentional lockfile or build artifact changes.
