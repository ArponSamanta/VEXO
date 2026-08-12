## 2026-03-02 - Accessible Grid Product Cards

**Learning:** Nesting interactive elements like "Add to Cart" or "Wishlist" buttons inside a product `<Link>` creates invalid HTML nesting and broken keyboard navigation. Screen readers can fail to correctly parse nested interactive trees, and visual focus highlights are often clipped by image bounds. Furthermore, having separate image links and title links creates redundant keyboard tab stops for sighted keyboard users.

**Action:** Separate the card's visual container into an image wrapper (with `tabIndex={-1}` for cleaner tab flow) and interactive action button group outside of the main navigation link. Show the hover actions also on `group-focus-within` so keyboard-only users can access action buttons when focusing them. Apply `role="img"` and descriptive `aria-label`s to composite elements like star ratings to provide a single, clear announcement for screen reader users.
