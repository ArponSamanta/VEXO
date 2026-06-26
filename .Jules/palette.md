# Palette's Journal

## 2026-06-26 - Accessible Product Quick Actions
**Learning:** Nesting interactive elements (like buttons) inside a Link component is an accessibility anti-pattern that breaks screen readers and causes invalid HTML. Use a common relative parent and siblings instead.
**Action:** Always verify that interactive elements are siblings, not descendants of other interactive elements. Use `group-focus-within` to reveal hidden actions for keyboard users.
