# Palette's Journal - Critical UX/Accessibility Learnings

This journal tracks critical UX and accessibility insights discovered during the development of VEXO.

## 2025-05-14 - Accessible Product Discovery
**Learning:** Nesting interactive elements like buttons inside a product card link is an accessibility anti-pattern that breaks keyboard navigation and causes screen reader confusion. Using `group-focus-within` allows hidden quick-actions to remain discoverable for keyboard-only users.
**Action:** Always use a relative container for product cards where quick-action buttons are siblings to the main link, and ensure they are made visible on both hover and focus-within states.
