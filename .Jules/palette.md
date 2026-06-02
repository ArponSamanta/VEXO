## 2025-05-15 - ProductCard Accessibility & HTML Validity
**Learning:** Nesting interactive elements like `button` inside a `Link` (anchor) is invalid HTML and prevents keyboard users from reaching the buttons. Additionally, "hover-only" actions are completely inaccessible to keyboard and screen reader users unless `group-focus-within` patterns are used.
**Action:** Always decouple interactive elements. Use absolute positioning and `group-focus-within:opacity-100` to ensure quick actions are visible and reachable when tabbing through a card.
