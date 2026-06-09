## 2026-06-09 - Accessibility Pattern for Star Ratings
**Learning:** When implementing star ratings, applying `role="img"` and a descriptive `aria-label` to the wrapper `div` (excluding text nodes like review counts) and setting `aria-hidden="true"` on individual icons ensures screen readers provide a single clear announcement.
**Action:** Always wrap star icons in a semantic image role container and hide the decorative icons themselves.

## 2026-06-09 - Keyboard Visibility for Hover Actions
**Learning:** Elements visible only on hover (like "Quick Actions") must also be visible on focus to support keyboard users.
**Action:** Use `group-focus-within:opacity-100` alongside hover classes.
