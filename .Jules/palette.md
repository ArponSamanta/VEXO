## 2026-06-11 - [Accessible Product Card]
**Learning:** Nesting interactive elements like buttons inside a Link is a common accessibility anti-pattern that breaks keyboard navigation and screen reader behavior.
**Action:** Always use a shared relative parent container for images and quick actions, and use `group-focus-within` to ensure hidden actions are accessible to keyboard users.
