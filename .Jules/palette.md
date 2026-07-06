## 2025-07-06 - Accessible Product Cards
**Learning:** Nesting interactive elements (buttons) inside an anchor tag (`Link`) is invalid HTML and breaks keyboard navigation/screen reader behavior. Additionally, hover-only actions are inaccessible to keyboard users unless explicitly handled with `focus-within` or similar states.
**Action:** Always separate action buttons from the main product link. Use `group-focus-within` to ensure quick actions are visible during keyboard navigation.
