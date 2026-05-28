# Palette's Journal

## 2025-05-14 - Nested Interactive Elements in Product Cards
**Learning:** Nesting interactive elements (like buttons) inside an anchor tag (`Link`) is invalid HTML and breaks keyboard navigation/screen reader behavior. The parent link often intercepts clicks or focus, making the nested buttons inaccessible or confusing.
**Action:** Use a shared relative parent container for the link and buttons, and position the buttons absolutely to maintain the desired visual layout while keeping them as siblings in the DOM.
