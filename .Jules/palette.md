## 2025-05-15 - Fixing Nested Interactive Elements and Enhancing Card Accessibility
**Learning:** Nesting buttons inside a `Link` component is an accessibility anti-pattern that breaks keyboard navigation and produces invalid HTML. Furthermore, elements only visible on hover (like "Quick Actions") must also be triggered by `:focus-within` to be accessible to keyboard users.
**Action:** Use a shared relative parent container for links and overlay buttons instead of nesting. Always apply `group-focus-within` visibility classes alongside `group-hover` for any hidden interactive elements.
