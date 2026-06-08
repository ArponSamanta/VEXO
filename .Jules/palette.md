## 2025-05-15 - [Nested Interactive Elements Accessibility]
**Learning:** Nesting interactive elements like buttons inside a parent `Link` or anchor tag is invalid HTML and breaks navigation for keyboard and screen reader users. It prevents children from being reached via Tab and causes confusing behavior for assistive technologies.
**Action:** Always use a shared relative parent container for the link and other actions, and use absolute positioning or layout techniques to overlay buttons if necessary, keeping them as sibling elements in the DOM.
