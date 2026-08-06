## 2026-08-06 - Accessible User Menus & Navigations
**Learning:** Accessible interactive menus must use exact ARIA identifiers, states (`aria-expanded`, `aria-controls`), and CSS-based focus indicators (`group-focus-within`) to ensure keyboard-only screen reader users are able to access hover-revealed action menus seamlessly.
**Action:** Always employ `group-focus-within` on multi-level layouts and dropdown list triggers so that key transitions and submenus are fully traversable during keyboard tab navigation.
