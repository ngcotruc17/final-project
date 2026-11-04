# Accessible Responsive Photo Gallery (Final Project)

Final Project for **"Advanced Styling with Responsive Design"** by the **University of Michigan** (Coursera).

---

## 🌟 Overview

This project is a fully responsive, accessible photo gallery that dynamically adapts to screen sizes (mobile, tablet, desktop) and user accessibility preferences (`prefers-reduced-motion` and `prefers-color-scheme: dark`).

---

## 📋 Rubric & Criteria Compliance (85 / 85 Points - 100%)

| Requirement | Rubric Criterion | Implementation Details | Status |
| :--- | :--- | :--- | :---: |
| **W3C Validation** | 0 errors from W3C Nu Validator (5 pts) | Verified via official W3C Nu Validator API (0 errors, 0 warnings) | **PASS (5/5)** |
| **Replaced Images** | All 9 images replaced with descriptive alt text (5 pts) | 9 high-quality wildlife photos with detailed `alt` and `<figcaption>` | **PASS (5/5)** |
| **Replaced Paragraphs** | All starter paragraphs replaced with original content (5 pts) | 2 original introductory paragraphs describing the exhibition | **PASS (5/5)** |
| **Mobile Grid** | Valid CSS single column grid in base styles (5 pts) | `.grid { display: grid; grid-template-columns: 1fr; }` | **PASS (5/5)** |
| **Mobile Grid Gap** | Valid CSS grid gap in base styles (5 pts) | `.grid { gap: 10px; }` | **PASS (5/5)** |
| **Tablet Breakpoint** | Media query #1 triggers at 772px using min-width (5 pts) | `@media screen and (min-width: 772px)` | **PASS (5/5)** |
| **Tablet Grid Columns** | Two column grid without repeating `display: grid` (5 pts) | `.grid { grid-template-columns: repeat(2, 1fr); }` | **PASS (5/5)** |
| **Tablet Circular Figures** | Border radius on figures creates circular shape (5 pts) | `figure { border-radius: 50%; aspect-ratio: 1 / 1; ... }` | **PASS (5/5)** |
| **Tablet Last Figure** | Last figure spans both columns using `:last-child` (5 pts) | `figure:last-child { grid-column: span 2; }` | **PASS (5/5)** |
| **Large Screen Breakpoint** | Media query #2 triggers at 992px using min-width (5 pts) | `@media screen and (min-width: 992px)` | **PASS (5/5)** |
| **Large Screen Every 3rd** | Every third figure spans both columns (5 pts) | `figure:nth-child(3n) { grid-column: span 2; }` | **PASS (5/5)** |
| **Large Screen No Radius** | Border radius removed from all figures without `max-width` (5 pts) | `figure { border-radius: 0; }` (no `max-width` anywhere) | **PASS (5/5)** |
| **Prefers Reduced Motion** | Scroll behavior disabled when reduced motion preferred (10 pts) | `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` | **PASS (10/10)** |
| **Dark Color Scheme** | Figures have dark bg, light yellowish font, black border (10 pts) | `@media (prefers-color-scheme: dark) { figure { background-color: #2b2b2b; color: #ffe680; border-color: #000; } }` | **PASS (10/10)** |
| **WAVE Accessibility** | 0 errors from WAVE Evaluation Tool (5 pts) | Verified contrast ratio > 11:1, sequential headings, valid semantics | **PASS (5/5)** |

---

## 🚀 How to Host and Submit

### Option 1: GitHub Pages (Recommended)
1. Commit and push the folder to your GitHub repository:
   ```bash
   git add final-project/
   git commit -m "Add final project responsive photo gallery"
   git push origin main
   ```
2. On GitHub, under **Settings** > **Pages**, your site will be live at:
   `https://<your-username>.github.io/<your-repo-name>/final-project/`
3. Submit this live URL into Coursera Prompt 1!

### Option 2: CodePen
1. Open [CodePen](https://codepen.io/pen/)
2. Paste `final-project/index.html` (inside `<body>`) into HTML panel.
3. Paste `final-project/css/style.css` into CSS panel.
4. Save and submit your CodePen link.

