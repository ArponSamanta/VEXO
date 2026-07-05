## 2024-05-15 - Improving Accessibility and Valid HTML in Product Cards
**Learning:** Nesting interactive elements (like buttons) inside a Link component is invalid HTML and breaks keyboard navigation/screen reader expectations. Using group-focus-within allows showing hidden actions on keyboard focus, making them accessible to all users.
**Action:** Always ensure interactive elements are siblings rather than children of links. Use Tailwind's focus-within utilities to reveal elements that are hidden by default on hover.
