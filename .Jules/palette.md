## 2025-01-24 - [Accessibility Improvements]
**Learning:** Icon-only buttons (like search, wishlist, cart, and quantity controls) are common UX patterns but are inaccessible to screen readers without explicit ARIA labels. Adding `aria-label` to these elements significantly improves the experience for users with visual impairments without affecting the visual design.
**Action:** Always check for icon-only interactive elements and ensure they have descriptive `aria-label` attributes.
