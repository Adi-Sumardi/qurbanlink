# Design System Document: The Sacred Steward

## 1. Overview & Creative North Star
### Creative North Star: "The Organic Sanctuary"
This design system moves away from the sterile, rigid grids of traditional SaaS and towards an "Organic Sanctuary" aesthetic. In the context of Qurban (sacrificial distribution), the UI must balance professional logistics with the sanctity of the act. We achieve this through **Soft Minimalism**: a high-end editorial approach that uses expansive white space, intentional asymmetry, and a "No-Line" philosophy.

The goal is to create a digital experience that feels as breathable and grounded as a premium botanical journal. We break the "template" look by layering surfaces rather than boxing them in, ensuring the interface feels like an interconnected ecosystem rather than a series of isolated data points.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is rooted in a deep, authoritative Emerald (`primary: #004532`) and a clean, expansive base (`surface: #f7f9fb`).

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined solely through background color shifts or tonal transitions.
*   **Sectioning:** Use `surface-container-low` for secondary sections sitting on a `surface` background.
*   **Nesting:** To create depth, stack a `surface-container-lowest` (pure white) card atop a `surface-container` section. This creates a natural "lift" without the visual clutter of lines.

### Glass & Gradient Signature
To move beyond "out-of-the-box" UI, use Glassmorphism for floating elements (e.g., navigation bars or livestock detail overlays).
*   **Glass Effect:** Use `surface` at 80% opacity with a `24px` backdrop-blur.
*   **Signature Gradients:** Apply a subtle linear gradient from `primary` (#004532) to `primary_container` (#065f46) for hero CTAs and primary action buttons. This adds "visual soul" and prevents the green from feeling flat or muddy.

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to create a sophisticated, high-contrast hierarchy.

*   **Display & Headlines (Manrope):** This geometric sans-serif provides a modern, authoritative weight. Use `display-lg` for impactful metrics (e.g., total animals distributed) and `headline-md` for section titles.
*   **Body & Labels (Inter):** Chosen for its exceptional legibility in data-heavy SaaS environments. Use `body-md` for standard text and `label-sm` for metadata and livestock IDs.

**Hierarchy Note:** Use wide letter-spacing (tracking) for `label-md` in all-caps to denote "Status" or "Category" headers, providing a premium, editorial feel.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows and borders are replaced by **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking" the surface tiers.
    *   *Base:* `surface` (#f7f9fb)
    *   *Mid-Level Content:* `surface-container-low` (#f2f4f6)
    *   *High-Level Interaction (Cards):* `surface-container-lowest` (#ffffff)
*   **Ambient Shadows:** If a "floating" effect is required (e.g., a modal or a floating action button), use a shadow with a `32px` blur and `4%` opacity, tinted with `primary` (#004532) rather than grey. This mimics natural light filtered through a canopy.
*   **The "Ghost Border" Fallback:** If a border is essential for accessibility, use `outline-variant` at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components: Refined Utility

### Buttons & Chips
*   **Primary Button:** Gradient from `primary` to `primary_container`. Roundedness: `full` (pill-shape).
*   **Secondary/Tertiary:** Use `surface-container-high` as the background with `on_surface` text. No border.
*   **Chips:** Use `secondary_fixed` (#6ffbbe) for status indicators like "In Transit" or "Allocated." Use `md` (0.75rem) corner radius.

### Input Fields & Cards
*   **Input Fields:** Use `surface_container_highest` for the field background with a `Ghost Border`. When focused, transition the background to `surface_container_lowest` and add a `primary` 1px glow.
*   **Cards:** Forbid divider lines. Use vertical white space and `headline-sm` titles to separate content chunks. Cards should utilize the `lg` (1rem) roundedness scale.

### Contextual Components for Qurban
*   **Livestock Health Cards:** Use a large `display-sm` number for weight/age, paired with high-quality line-art livestock icons in `primary`.
*   **Distribution Progress Bar:** A thick, `8px` bar using `primary_fixed` as the track and a `primary` gradient for the progress.
*   **Sanctity Badges:** Small, editorial-style labels for "Halal Certified" or "Verified Weight" using `tertiary` (#652925) text on `tertiary_fixed` (#ffdad6) backgrounds for high-contrast warnings/verifications.

---

## 6. Do’s and Don’ts

### Do
*   **Do** lean into asymmetry. For example, left-align a headline and right-align a "livestock silhouette" icon that bleeds off the edge of the container.
*   **Do** use `primary_fixed_dim` (#8bd6b6) for soft backgrounds behind iconography to create a "glow" effect.
*   **Do** prioritize high-quality, custom-drawn SVG icons of animals (sheep, cattle, goats) with thin, consistent stroke weights.

### Don’t
*   **Don’t** use pure black (#000000). Always use `on_surface` (#191c1e) for text to maintain a soft, premium look.
*   **Don’t** use standard 4px "web-style" corners. Adhere strictly to the `md` (0.75rem) and `lg` (1rem) scales to ensure a friendly, approachable feel.
*   **Don’t** use harsh dividers. If you feel the need for a line, try a background color shift first.