## 2025-05-14 - Fix Nested Interactive Elements and Keyboard Visibility

**Learning:** Nesting interactive elements like buttons inside a `Link` (anchor tag) is invalid HTML and breaks keyboard navigation/screen readers. Additionally, UI elements that only appear on hover are inaccessible to keyboard users unless they also trigger on focus-within.

**Action:** Always use a shared relative container for Links and Action Buttons instead of nesting. Use Tailwind's `group-focus-within` to ensure hover-only overlays are visible when a keyboard user tabs into them.
