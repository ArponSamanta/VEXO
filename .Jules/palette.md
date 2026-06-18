## 2025-05-14 - Accessible Product Card Pattern
**Learning:** Nested interactive elements (buttons inside a Link) are invalid HTML and break screen reader/keyboard navigation. Additionally, actions only visible on hover are inaccessible to keyboard users unless explicitly handled.
**Action:** Use a shared relative container to keep Link and buttons as siblings. Use `group-focus-within` to ensure hover-only actions are visible when tabbing.
