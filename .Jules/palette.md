## 2026-07-11 - Accessibility Restructuring in Product Cards
**Learning:** Nesting interactive elements (like buttons) inside a Link or anchor tag is an accessibility anti-pattern that breaks the accessibility tree and keyboard navigation. Moving them to a shared relative container with absolute positioning preserves visual layout while ensuring a clean accessibility tree.
**Action:** Always verify component structure for nested interactivity and use peer/sibling containers with relative/absolute positioning instead.
