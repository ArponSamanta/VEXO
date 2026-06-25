## 2025-05-15 - Fixing Nested Interactive Elements in Product Cards
**Learning:** Nesting buttons or other links inside a parent `Link` (anchor tag) is invalid HTML and prevents screen readers and keyboard users from reliably accessing the inner interactive elements. Hover-only actions also exclude keyboard-only users if they don't have a `focus-within` trigger.
**Action:** Use a shared relative container for both the primary `Link` and quick action buttons as siblings. Apply `group-focus-within` to the actions container to ensure visibility during keyboard navigation.
