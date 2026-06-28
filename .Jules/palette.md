## 2026-05-20 - Accessible Hover-to-Reveal Patterns

**Learning:** When using hover-to-reveal patterns (like quick actions on product cards), simply using `group-hover` is insufficient for accessibility as keyboard users cannot trigger hover. Additionally, nesting interactive elements like buttons inside a parent `Link` or anchor tag is invalid HTML and breaks screen reader navigation, often causing the screen reader to fail to announce the inner buttons or misinterpret the link's extent.

**Action:**
1. Use a shared relative container for the `Link` and overlay buttons, keeping them as siblings in the DOM.
2. Use absolute positioning to place the buttons over the link visually.
3. Apply `group-focus-within` (in addition to `group-hover`) to the hidden elements to ensure they become visible when they receive keyboard focus.
4. Apply `pointer-events-none` to decorative overlays (like badges) that sit on top of links to ensure they don't block clicks.
