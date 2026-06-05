## 2025-05-14 - Accessible Interactive Components Overlays

**Learning:** Nesting interactive elements (like buttons) inside a parent `Link` or anchor tag is an accessibility anti-pattern and invalid HTML that breaks navigation for keyboard and screen reader users. Additionally, hover-only "quick action" overlays are inaccessible to keyboard users unless explicitly handled.

**Action:** When implementing product card actions or similar overlays:
1. Ensure interactive elements are siblings to the main link, not children.
2. Use a shared relative container to position buttons absolutely over the card.
3. Use `group-focus-within` and `focus-within:opacity-100` (or similar focus-visible states) to ensure overlays are visible when a child element receives focus via keyboard tabbing.
4. Always provide descriptive `aria-label` for icon-only buttons.
