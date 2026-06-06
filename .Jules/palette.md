## 2026-06-06 - [Accessibility Anti-pattern: Nested Interactive Elements]
**Learning:** Nesting interactive elements like buttons or links inside another link is invalid HTML and breaks navigation for keyboard and screen reader users. The outer link intercepts clicks or focus, making the inner elements inaccessible or confusing to navigate.
**Action:** Always use a shared relative parent container and position interactive elements as siblings to the main link. Use focus-within utilities to ensure hidden actions are revealed to keyboard users.
