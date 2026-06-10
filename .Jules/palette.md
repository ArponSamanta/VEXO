## 2025-05-14 - [ProductCard Accessibility Fix]
**Learning:** Nesting interactive elements like buttons inside an anchor (`Link`) is a common but major accessibility anti-pattern. It confuses screen readers and breaks keyboard navigation. Using a shared relative container for the link and buttons allows them to be siblings, which is semantic and accessible.
**Action:** Always check for nested interactive elements in component structures and refactor to use sibling elements in a common container when needed.
