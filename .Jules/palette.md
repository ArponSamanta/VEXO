# Palette's Journal - Critical UX/accessibility learnings

## 2026-07-26 - Keyboard Navigation & Screen Reader Best Practices on Product Cards
**Learning:** Nesting interactive buttons inside a React Router `Link` component creates invalid HTML and completely breaks keyboard/screen-reader navigation. Furthermore, duplicate endpoints such as card image links and card titles that lead to the same URL should have `tabIndex={-1}` on the non-text link to minimize redundant tab stops.
**Action:** Keep interactive actions physically separated from wrapping layout anchors, group elements using Tailwind's `group-focus-within` to present quick actions during keyboard focus, and attach descriptive `aria-label` tags with product-specific details (e.g. `aria-label={"Add " + product.name + " to cart"}`) for screen readers.
