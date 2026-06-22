## 2025-06-22 - Keyboard accessibility for hidden overlays
**Learning:** When using Framer Motion or Tailwind's opacity/visibility for dropdowns/overlays (like the Navbar User menu), relying on hover is insufficient for keyboard users.
**Action:** Always apply 'group-focus-within:opacity-100' and 'group-focus-within:visible' to parent containers of hidden interactive elements to ensure they remain accessible when tabbed into.
