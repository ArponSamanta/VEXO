# Palette's UX Journal

## 2026-03-01 - Keyboard Accessibility in Hover-Triggered Grid Elements
**Learning:** Interactive elements hidden by hover-only selectors are inaccessible to keyboard navigators unless brought into visibility via `focus-within` triggers on the parent component. Additionally, duplicate links (image and text title) for the same route create unnecessary tab stops that fatigue keyboard users.
**Action:** Always set `tabIndex={-1}` on decorative or image links when a text link is present, use `group-focus-within` Tailwind utilities to reveal quick-action panels, and apply `pointer-events-none` to non-interactive badge overlays to avoid click interception.
