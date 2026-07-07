## 2024-05-24 - Accessible Interactive Overlays & Ratings

**Learning:** Hidden-by-default interactive elements (like product quick actions or dropdowns) are often inaccessible to keyboard users if they only rely on hover. Using Tailwind's `group-focus-within` allows these elements to become visible when a child element receives focus, ensuring parity between mouse and keyboard experiences. Additionally, complex visual patterns like star ratings should be treated as a single image (`role="img"`) with a descriptive `aria-label` to avoid screen reader noise from individual icons.

**Action:** Always pair `group-hover` with `group-focus-within` for interactive overlays. Wrap star rating icons in a container with `role="img"` and `aria-label`, and set `aria-hidden="true"` on the individual icons.
