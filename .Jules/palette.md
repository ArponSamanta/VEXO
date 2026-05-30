## 2025-05-14 - Fix Nested Interactive Elements in Product Cards
**Learning:** Nesting buttons inside a `Link` component is an accessibility anti-pattern that breaks keyboard navigation and screen reader behavior. It also produces invalid HTML.
**Action:** Use a relative container for the card, and position quick action buttons as siblings to the main product link. Use `group-focus-within` to ensure hidden actions are revealed to keyboard users.

## 2025-05-14 - Star Rating Accessibility
**Learning:** Screen readers often announce each star icon individually if not handled correctly, leading to "star, star, star, star, star" instead of "4 out of 5 stars".
**Action:** Apply `role="img"` and a descriptive `aria-label` to the rating container, and hide individual icons using `aria-hidden="true"`.
