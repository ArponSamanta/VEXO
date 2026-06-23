## 2025-05-14 - Product Quick Actions Accessibility
**Learning:** Hidden-on-hover actions (like 'Add to Cart' in a product grid) are inaccessible to keyboard and screen reader users unless explicitly handled with focus states and descriptive labels.
**Action:** Always use `group-focus-within` to reveal hover-only overlays and provide context-rich `aria-label`s for icon buttons in lists.
