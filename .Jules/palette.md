## 2026-06-07 - Nested Interactive Elements Anti-pattern
**Learning:** Nesting interactive elements (buttons/links) inside a parent Link is invalid HTML and breaks navigation for keyboard and screen reader users. Additionally, UI elements that only appear on hover are inaccessible to keyboard users unless explicitly handled.
**Action:** Always structure interactive elements as siblings within a shared relative container. Use 'group-focus-within' Tailwind classes to ensure hover-only actions are visible when tabbing through the interface.
