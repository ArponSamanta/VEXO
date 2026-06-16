## 2025-05-14 - Accessible Interactive Overlays
**Learning:** Nested interactive elements (e.g., buttons inside a `Link`) are invalid HTML and cause issues for screen readers and keyboard navigation. Additionally, elements that only appear on hover are invisible to keyboard users unless explicitly handled.
**Action:** Use a shared relative parent container to house both the primary `Link` and interactive overlays (like "Add to Cart" buttons) as siblings. Apply `group-focus-within:opacity-100` to ensure overlays are visible when keyboard-focused.

## 2025-05-14 - Semantic Star Ratings
**Learning:** Individual star icons in a rating component can create "noise" for screen readers if each one is announced.
**Action:** Apply `role="img"` and a descriptive `aria-label` (e.g., "4.5 out of 5 stars") to the rating container, while setting `aria-hidden="true"` on the individual star icons to ensure a single, clear announcement.
