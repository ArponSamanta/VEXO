## 2025-05-21 - Keyboard Accessibility for Hover-only Elements
**Learning:** Elements that only appear on hover (like quick action buttons on product cards) are inaccessible to keyboard users unless explicitly handled. Using Tailwind's `group-focus-within` allows these elements to become visible when any child element receives focus via tabbing.
**Action:** When implementing "hover-to-reveal" patterns, always include `group-focus-within` utility classes to ensure the interface remains fully navigable and functional for keyboard-only users.
