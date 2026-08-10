# Palette UX & Accessibility Journal

This journal logs critical UX and accessibility learnings, insights, and reusable patterns discovered within the codebase.

## 2025-02-18 - Nested Interactive Elements & Grid Quick-Actions
**Learning:** Nesting interactive buttons (like "Add to Cart" or "Wishlist") inside an anchor or React Router `Link` component creates severe HTML validation issues, invalid accessibility trees, and keyboard traps. Furthermore, displaying quick action overlays on cards only on mouse hover hides them from keyboard and screen reader users entirely.
**Action:**
1. Always keep interactive elements in a sibling container or separate from any wrapper anchor tag. Let the image be in a separate, non-interactive visual link with `tabIndex={-1}` and `aria-hidden="true"`, while keeping the title heading link fully focusable.
2. For hover-revealed overlay elements, use Tailwind's `group-focus-within:opacity-100` and `group-focus-within:translate-y-0` (or similar transition classes) on the overlays, with `group` on the parent container, so keyboard focus reveals the hidden actions automatically.
3. Make sure to apply `pointer-events-none` on visual text badges positioned over interactive components to ensure mouse clicks and hovers pass through cleanly.
