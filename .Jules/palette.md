## 2025-05-14 - Fixing Nested Interactive Elements and Keyboard Accessibility in Product Cards
**Learning:** Nesting interactive elements (like buttons) inside an anchor tag (`Link`) is an accessibility anti-pattern and invalid HTML. Additionally, elements that are only visible on hover are inaccessible to keyboard users unless they are also shown on focus.
**Action:** Always place interactive elements as siblings rather than children of a parent link. Use `group-focus-within` in Tailwind to ensure that hidden actions become visible when any element within the group receives focus.
