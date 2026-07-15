
## 2026-07-15 - Accessible Product Cards with Keyboard-Visible Actions
**Learning:** Found a pattern where interactive quick actions (Add to Cart, Wishlist) were nested inside a parent Link, which is invalid HTML and breaks screen reader navigation. Additionally, hover-only actions were inaccessible to keyboard users.
**Action:** Use a relative container to house both the primary Link (for the image/product) and the quick action buttons as siblings. Apply Tailwind's `group-focus-within` utilities to reveal actions when they or any sibling in the group receive focus.
