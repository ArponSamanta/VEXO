## 2025-05-15 - Improving ProductCard Keyboard Accessibility
**Learning:** Elements that are only visible on hover (like product quick actions) are inaccessible to keyboard users unless explicitly handled with focus states. Using Tailwind's `group-focus-within` allows these elements to be revealed when a child element (like a button) receives focus via keyboard navigation.
**Action:** Always ensure that any hover-only interactive elements also have a `:focus-within` or `:focus-visible` state to remain accessible to all users.
