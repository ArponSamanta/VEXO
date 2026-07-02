## 2025-05-15 - [Accessible Quick Actions on Product Cards]
**Learning:** Hover-only interactive elements (like "Add to Cart" buttons on product cards) are inaccessible to keyboard users and screen readers if not properly handled. Using Tailwind's `group-focus-within` allows these elements to be revealed when they receive focus, ensuring keyboard navigability.
**Action:** Always ensure that any UI element revealed on hover is also revealed when a child element receives focus using `group-focus-within` or similar focus-state triggers.
