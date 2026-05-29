# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-05-14 - [Accessibility] Nested Interactive Elements in ProductCard
**Learning:** Nesting buttons or other interactive elements inside a `Link` or anchor tag is invalid HTML and breaks navigation for keyboard and screen reader users. The parent `Link` often intercepts clicks or confuses the focus order.
**Action:** Use a shared relative parent container and absolute positioning to keep them as siblings visually, while ensuring they are separate in the DOM. Use `group-focus-within` to show hidden actions on keyboard focus.
