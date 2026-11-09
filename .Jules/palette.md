## 2025-05-14 - Keyboard Accessibility for Hover-only Actions
**Learning:** Elements that are only visible on hover (like product quick actions) are inaccessible to keyboard users unless they are also shown on focus-within.
**Action:** Use Tailwind's `group-focus-within:opacity-100` and `group-focus-within:translate-y-0` on containers that hold hover-triggered actions to ensure they appear when a user tabs into them.

## 2025-05-14 - Star Rating Accessibility
**Learning:** Screen readers may announce each star icon individually if not properly grouped. Using `role="img"` and a descriptive `aria-label` on the parent container, while hiding individual stars with `aria-hidden="true"`, provides a much clearer experience.
**Action:** Always wrap star ratings in a container with `role="img"` and a calculated `aria-label`, and hide the decorative star icons from screen readers.
