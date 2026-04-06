# Design System Specification: The Urban Curator

## 1. Overview & Creative North Star
**Creative North Star: "The Urban Curator"**

This design system is built to move beyond the transactional nature of real estate. We are not building a listing site; we are crafting an editorial experience that celebrates urban Nigerian living. "The Urban Curator" rejects the cluttered, grid-heavy "template" look of traditional property apps. Instead, it utilizes **Organic Asymmetry** and **Editorial Scale** to create a feeling of liberation and premium trust.

The system breaks the "boring box" mold by using overlapping elements—such as property tags that bleed over image boundaries—and a dramatic contrast between massive, confident display type and refined, airy functional text. It is designed to feel like a high-end lifestyle magazine that happens to be an app.

---

### 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is anchored in the stability of `primary` Deep Teal and the energy of `secondary` Electric Blue. However, the sophistication lies in how we layer these tones.

**The "No-Line" Rule**
To maintain a premium, seamless aesthetic, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through background color shifts or tonal transitions.
*   *Implementation:* A property description block (`surface-container-low`) should sit on the main page (`surface`) without a stroke. Use white space as your primary divider.

**Surface Hierarchy & Nesting**
Treat the UI as a series of physical layers, like stacked sheets of frosted glass.
*   **Base:** `surface` (#f8f9fa)
*   **Sectioning:** `surface-container-low` (#f3f4f5) for large content areas.
*   **Elevation:** `surface-container-lowest` (#ffffff) for interactive cards.
*   **Prominence:** `surface-container-highest` (#e1e3e4) for persistent navigation or search bars.

**The Glass & Gradient Rule**
Flat color is the enemy of premium design. 
*   **Signature Textures:** Use subtle linear gradients for CTAs, transitioning from `primary` (#00535b) at the top-left to `primary_container` (#006d77) at the bottom-right.
*   **Glassmorphism:** For floating elements (like "Back to Top" buttons or bottom navigation), use a 70% opacity `surface_container_lowest` with a `20px` backdrop-blur.

---

### 3. Typography: Confident & Clear
We pair the architectural strength of **Plus Jakarta Sans** with the utilitarian clarity of **Manrope**.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Editorial Voices." Use `display-lg` for hero headers (e.g., "Find your home in Lekki"). Use tight letter-spacing (-0.02em) to make headings feel solid and authoritative.
*   **Body & Labels (Manrope):** These are our "Functional Voices." Manrope provides high legibility at small sizes for property specs and lease details. 
*   **Hierarchy Tip:** Never settle for mid-range sizes. If a headline is important, make it massive (`headline-lg`). If it’s supporting text, keep it humble (`body-md`). This "high-contrast" scaling is what creates the high-end feel.

---

### 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often messy. We prefer **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a "soft lift" that is felt rather than seen.
*   **Ambient Shadows:** For floating elements (Modals, Primary Buttons), use a shadow with a 24px blur and only 6% opacity. Use a tinted shadow: `rgba(0, 83, 91, 0.06)` (a tint of our `primary` color) to mimic natural light.
*   **The "Ghost Border" Fallback:** If accessibility requires a border (e.g., in a high-glare environment), use the `outline_variant` (#bec8ca) at **15% opacity**. It should be a whisper, not a shout.

---

### 5. Components
Our components are "friendly-professional," characterized by generous padding and intentional roundedness.

*   **Buttons:**
    *   **Primary:** Gradient-filled (`primary` to `primary_container`), `xl` (1.5rem) corner radius. Height: 56px for mobile-first thumb reach.
    *   **Secondary:** `surface_container_low` background with `on_secondary_container` text. No border.
*   **Property Cards:**
    *   Forbid dividers. Use a `1.5rem` (xl) corner radius.
    *   The "Overhang" Pattern: Property price tags should be positioned as a floating `primary_container` chip that overlaps the top-right corner of the image.
*   **Input Fields:**
    *   Background: `surface_container_high`. 
    *   State: Transition to a `2px` `primary` bottom-border only on focus to maintain a clean look.
*   **Image Gallery:**
    *   Images must use `lg` (1rem) rounded corners. 
    *   Always overlay a subtle 10% black-to-transparent gradient at the bottom of hero images to ensure white "Save" or "Share" icons remain legible.
*   **Amenity Chips:**
    *   Use `secondary_fixed` (#c6e7ff) background with `on_secondary_fixed` (#001e2d) text. These should feel "light" and airy.

---

### 6. Do’s and Don'ts

**Do:**
*   **Do** use asymmetrical margins. For example, a 24px left margin and a 16px right margin on property carousels to suggest the content "continues" off-screen.
*   **Do** prioritize Nigerian urban lifestyle photography. Focus on natural light, vibrant interior textures, and human connection (e.g., a family in a sunlit living room in Victoria Island).
*   **Do** use `9999px` (full) roundedness for selection chips to contrast with the `1rem` (lg) roundedness of cards.

**Don't:**
*   **Don't** use black (#000000). Use `on_surface` (#191c1d) for text to maintain a softer, premium feel.
*   **Don't** use dividers or lines to separate list items. Use 16px or 24px of vertical white space from the Spacing Scale.
*   **Don't** use standard icons. Use custom-weight, "Long-tail" iconography with a 1.5pt stroke that matches the weight of your `label-md` text.

---

### 7. Token Reference Summary

| Token Type | Value / Token | Usage |
| :--- | :--- | :--- |
| **Corner Radius** | `xl` (1.5rem) | Cards, Main Containers, Search Bars |
| **Corner Radius** | `full` (9999px) | Chips, Action Buttons |
| **Shadow** | `0 8px 24px rgba(0, 83, 91, 0.06)` | Floating Action Buttons, Modals |
| **Headline Font** | Plus Jakarta Sans | All Headlines and Large Titles |
| **Body Font** | Manrope | Descriptions, Labels, and Body Copy |
| **Border Rule** | 0px / None | All sectioning and card containers |