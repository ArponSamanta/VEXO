# Palette's Journal - Critical UX & Accessibility Learnings

This journal tracks critical UX and accessibility insights discovered during development.

## 2026-07-08 - Product Card Keyboard Accessibility & HTML Validity

**Learning:** Interactive elements (buttons, links) nested inside another anchor tag (`Link`) are invalid HTML and break keyboard navigation as browsers may strip or misinterpret nested interactive elements. Additionally, UI elements that only appear on hover are inaccessible to keyboard and screen reader users unless they are also triggered by focus-within states.

**Action:** Always place action buttons as siblings to the main card link within a relative container. Use Tailwind's `group-focus-within` utility alongside `group-hover` to ensure hidden actions become visible when any element inside the container receives focus.
