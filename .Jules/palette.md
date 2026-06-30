## 2025-05-14 - ProductCard Accessibility and Keyboard Navigation
**Learning:** Nesting interactive elements (buttons) inside a `Link` component is an accessibility anti-pattern that breaks screen reader navigation and keyboard interaction. Additionally, elements hidden only on hover are inaccessible to keyboard users unless explicitly handled with focus states like `group-focus-within`.
**Action:** Always separate interactive siblings using a shared relative container for absolute positioning, and use `group-focus-within` to mirror hover effects for keyboard focus.
