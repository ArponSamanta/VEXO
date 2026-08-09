# Palette's Critical UX & Accessibility Learnings

## 2026-03-01 - Nested Interactive Elements in Product Cards
**Learning:** Nesting interactive elements (like cart/wishlist buttons) inside a Link anchor creates nested interactive elements, violating the HTML specification, causing screen reader confusion, and breaking standard keyboard navigation.
**Action:** Lift the quick action buttons out of the image Link element, wrap them in a shared container that responds to both hover and focus-within states, and set `tabIndex={-1}` on redundant link wrappers to keep the tab flow clean and professional.
