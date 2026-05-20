## 2026-02-12 - [Accessibility: ARIA labels and focus states]
**Learning:** Icon-only buttons and hover-triggered actions (like quick actions on product cards) are common accessibility pitfalls. Adding `aria-label` to buttons and ensuring actions are visible on focus using `group-focus-within` significantly improves screen reader and keyboard navigation support.
**Action:** Always check for interactive elements without text and ensure hover-based UI reveals are also accessible via keyboard focus.
