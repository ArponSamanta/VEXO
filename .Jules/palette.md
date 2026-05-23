## 2025-05-14 - [Nested Interactive Elements in Product Cards]
**Learning:** Product cards often nest action buttons (Add to Cart, Wishlist) inside a main card `Link`. This creates an accessibility "anti-pattern" where interactive elements are nested, making navigation confusing for screen readers and keyboard users.
**Action:** Always wrap the main image in a separate `Link` and place action buttons as siblings within a relative container. Use `group-focus-within` on the action container to ensure visibility when a user tabs into the nested buttons.
