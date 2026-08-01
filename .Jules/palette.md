# Palette's Journal

## 2026-02-15 - Interactive Card Keyboard Accessibility & Screen Reader Star Ratings
**Learning:** In e-commerce product listings, card layouts often contain duplicate links (image and title heading pointing to the same route) which results in a redundant tab-stop. Furthermore, hover-only quick actions (such as 'Add to Cart' or 'Wishlist') are inaccessible to keyboard users unless explicitly exposed on focus. Lastly, standard star rating implementations consisting of individual interactive/visual star icons read out in a disjointed way on screen readers.
**Action:**
1. Prevent redundant focus/navigation stops by setting `tabIndex={-1}` on decorative elements like image wraps that duplicate navigation.
2. Ensure hover-triggered overlay elements are visually and interactively exposed on focus using Tailwind's `group-focus-within:` variants on the hover container.
3. Apply `role="img"` and a descriptive `aria-label` (e.g. `"Rated 4.5 out of 5 stars based on 12 reviews"`) to a wrapper div surrounding star elements while hiding individual child star icons using `aria-hidden="true"`.
