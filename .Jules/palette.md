## 2026-07-04 - [Accessible Star Ratings & Focus Visibility]
**Learning:** For components that use hover-triggered actions, `group-focus-within` is essential for keyboard accessibility. Using `role="img"` with a descriptive label for star ratings provides a much better screen reader experience than reading out five separate "star" icons.
**Action:** Always include `group-focus-within` on containers with hover-only children and implement the `role="img"` pattern for rating displays.
