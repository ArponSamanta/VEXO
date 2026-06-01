## 2026-06-01 - Accessible Hover Actions and Star Ratings

**Learning:** Interactive elements (buttons) nested inside a `Link` or anchor tag are invalid HTML and break navigation for keyboard/screen reader users. Additionally, elements that are hidden by default and only shown on hover (like "Add to Cart" buttons on product cards) must be made visible during keyboard navigation using `group-focus-within` to remain accessible.

**Action:** Always structure card-like components so that interactive elements are siblings of the main link, contained within a shared relative parent. Use Tailwind's `group-focus-within:opacity-100` to reveal quick actions when they receive focus. For complex visualizations like star ratings, use `role="img"` with a descriptive `aria-label` on the container and `aria-hidden="true"` on decorative icons.
