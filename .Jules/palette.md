## 2025-05-14 - Accessible Star Ratings and Keyboard Focus for Hover-only UI

**Learning:** Star ratings should be treated as a single informative image using `role="img"` and a descriptive `aria-label` (e.g., "4 out of 5 stars") on a wrapper, with `aria-hidden="true"` on individual icons. This prevents screen readers from announcing each star separately. Additionally, UI elements that only appear on hover (like "Quick Actions") must also be made visible on focus using Tailwind's `group-focus-within` utility to ensure keyboard accessibility.

**Action:** Always wrap star icons in a container with `role="img"` and `aria-label`. Use `group-focus-within` on containers with hover-triggered overlays to support keyboard navigation.
