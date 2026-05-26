## 2025-05-14 - Nested Interactive Elements in Product Cards
**Learning:** Nesting interactive elements like buttons inside an anchor tag (`Link`) is an accessibility anti-pattern. It breaks the expected behavior for screen readers and keyboard users. Additionally, elements hidden on hover must be made visible on focus to ensure they are accessible to keyboard-only users.
**Action:** Always structure quick actions as siblings to the main product link, and use Tailwind's `group-focus-within` to toggle visibility for keyboard navigation.
