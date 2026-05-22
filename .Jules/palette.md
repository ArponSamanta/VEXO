## 2025-05-14 - Keyboard Accessibility for Hover-only Actions
**Learning:** Product actions that only appear on hover (e.g., "Add to Cart", "Wishlist") are inaccessible to keyboard-only users because they remain hidden even when the buttons inside them receive focus.
**Action:** Use Tailwind's `group-focus-within` utility (e.g., `group-focus-within:opacity-100 group-focus-within:translate-y-0`) on containers that are hidden via hover-only classes to ensure they become visible when a user tabs into them.
