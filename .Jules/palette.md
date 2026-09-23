## 2026-09-23 - Separating Quick Action Overlays from Product Links & Focus Overlay Contrast

**Learning:** Nesting interactive `<button>` elements inside an `<a>` link container breaks HTML validation and causes screen readers to misinterpret or ignore interactive action buttons inside `aria-hidden` subtrees. Furthermore, when revealing hover-actions via `group-focus-within`, background gradient overlays must also trigger `group-focus-within:opacity-100` to preserve sufficient color contrast over light product images.

**Action:** Wrap product card images in a parent `div` container instead of an `a` or `Link` tag, keeping quick action buttons as siblings to the image link. Apply `group-focus-within:opacity-100` to both the quick action container and background gradient overlay.
