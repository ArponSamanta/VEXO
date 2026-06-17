## 2025-05-14 - Accessible Product Card Refactoring
**Learning:** Nesting interactive elements like buttons within a parent link (e.g., product image link) is an accessibility anti-pattern that breaks keyboard navigation and violates HTML standards. Additionally, hover-only quick actions must be made visible on focus for keyboard users.
**Action:** Use a relative sibling container for overlay actions and badges instead of nesting them in the main link. Apply `group-focus-within` Tailwind classes to ensure keyboard-triggered visibility for hidden UI elements.
