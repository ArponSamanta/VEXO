# Palette UX & Accessibility Journal

## 2026-03-05 - Nested Interactive Anchors and Keyboard Focus in Hover Cards
**Learning:** Nesting action buttons (`Add to Cart`, `Wishlist`) inside high-level hover `Link` elements violates semantic HTML (nested interactive elements) and causes screen readers to misbehave. Additionally, hiding overlays purely with hover `opacity-0` makes them inaccessible to keyboard tab navigation.
**Action:** Lift action buttons outside the wrapper `Link` so they are sibling components. Prevent redundant tab stops by adding `tabIndex={-1}` to the image Link, and use `group-focus-within:opacity-100` and `group-focus-within:translate-y-0` to guarantee that hover-only quick actions seamlessly slide and transition into view when buttons are focused via keyboard navigation.
