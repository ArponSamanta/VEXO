## 2026-06-19 - ProductCard Accessibility and Keyboard UX
**Learning:** Nesting interactive elements (buttons) inside an anchor tag (`Link`) is a critical accessibility violation that breaks keyboard navigation and screen reader behavior. Additionally, elements only visible on hover are inaccessible to keyboard users unless explicitly handled with `focus-within` patterns.
**Action:** Always separate secondary interactive actions from main card links using a shared relative container. Use `group-focus-within` to mirror hover effects for keyboard users.
