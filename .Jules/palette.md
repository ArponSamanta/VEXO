# Palette's UX Journal

## 2025-05-14 - Product Card Accessibility and Keyboard Navigation
**Learning:** Nesting interactive elements (like buttons) inside a 'Link' component is a common anti-pattern that breaks screen reader navigation and keyboard tabbing. Additionally, 'hover-only' quick actions are invisible to keyboard users unless explicitly triggered by 'group-focus-within'.
**Action:** Always separate action buttons from navigational links using a shared relative parent. Use 'group-focus-within' to reveal hidden interactive overlays when any child element receives focus.
