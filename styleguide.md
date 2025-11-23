# TalkingScientist Theme - CSS Styling Guide

Here's a complete guide to replicate the theme's styling in standalone HTML files.

## Design Tokens (CSS Custom Properties)

The theme uses a comprehensive token system defined in `:root`.

### Color System - Dark Theme (Default)

```css
--bg: #0B0C0E;              /* Lab Night - main background */
--surface: #121316;         /* Dark Steel - elevated surfaces */
--muted-surface: #17181C;   /* Slightly lighter surface */
--hairline: #ff0000;        /* Red border color */
--text-1: #E5E7EB;          /* Mist - primary text */
--text-2: #9CA3AF;          /* Zinc - secondary/muted text */
--accent: #ff0000;          /* Signal Red - primary accent */
--accent-2: #ff0000;        /* Ion Cyan - secondary accent */
--success: #22C55E;
--warning: #F59E0B;
--danger: #DC2626;
```

### Light Theme Variant

Add `class="theme-light"` to `<body>` for light mode:

```css
--bg: #FAFAFA;
--surface: #FFFFFF;
--muted-surface: #F6F7F8;
--text-1: #0B0C0E;          /* Inverted for readability */
--text-2: #4B5563;
```

### Typography

```css
--font-sans: "Space Grotesk";
--font-head: "Space Grotesk", var(--font-sans);
--font-mono: monospace;
```

- Body: Space Grotesk, 16px base (set to small), 1.6 line-height
- Headings: Space Grotesk, weight 600
- Code/Timestamps: Monospace font

### Spacing Scale (8pt Grid)

```css
--sp-1: 8px;
--sp-2: 12px;
--sp-3: 16px;
--sp-4: 24px;
--sp-5: 32px;
--sp-6: 48px;
--sp-7: 64px;
```

### Other Tokens

```css
--radius-1: 2px;            /* Subtle rounding */
--radius-2: 4px;            /* Standard rounding */
--shadow-1: 0 1px 0 rgba(0, 0, 0, 0.4);
--shadow-lift: 0 2px 4px rgba(0, 0, 0, 0.5);
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-out;
```

## Typography Hierarchy

### Headings

- **h1**: clamp(28px, 6vw, 40px), 1.15 line-height
- **h2**: font-size: larger, 1.2 line-height
- **h3**: 18px, 1.25 line-height
- **All headings**: 600 weight, 16px bottom margin

### Body Text

- 16px base, line-height: 1.6
- text-rendering: optimizeLegibility
- -webkit-font-smoothing: antialiased

### Code

- **Inline `<code>`**: 0.9em size, cyan color (--accent-2), 2px/4px padding
- **`<pre>` blocks**: Muted surface background, 1px hairline border, 16px padding

## Layout Structure

### Three-Column Fixed Grid

  ┌──────────────────────────────────────────┐
  │ Header (sticky, 73px height)             │
  ├────────┬──────────────────┬──────────────┤
  │ Left   │ Main Content     │ Right        │
  │ 280px  │ Fluid            │ 300px        │
  │ Fixed  │                  │ Fixed        │
  └────────┴──────────────────┴──────────────┘
```

### Sidebar Specifications

- **Left sidebar**: 280px wide, fixed position, red hairline right border
- **Right sidebar**: 300px wide, fixed position, red hairline left border
- **Content area**: Fluid width with margin-left: 280px, margin-right: 300px
- **Both sidebars**: height: calc(100vh - 73px), overflow-y auto, positioned at top: 73px

### Responsive Breakpoints

- **≤1024px**: Left sidebar shrinks to 220px, right sidebar moves below content
- **≤768px**: All stack vertically, sidebars become relative positioned

## Component Patterns

### Cards

```css
background: var(--surface);
border: 1px solid #ff0000;
border-radius: var(--radius-1);
padding: var(--sp-4);
box-shadow: var(--shadow-1);
```

Add `.card-hover` for lift effect on hover: `translateY(-2px)` + elevated shadow

### Navigation Links

- Left border indicator: 2px transparent, becomes `--accent` on hover/active
- No underline, block display, 6px vertical padding, 10px left padding
- `.current` or `[aria-current="page"]`: Bold weight, accent color, visible border

### Post Meta Rails

Distinctive horizontal bars with monospace text:

```css
border-top: 1px solid var(--accent);    /* Red for posts */
border-bottom: 1px solid var(--accent);
font-family: var(--font-mono);
font-size: 14px;
padding: 12px 0;
```

- **Lab Notes variant**: Use `--accent-2` (cyan) for borders
- **Author prefix**: `::` in accent color
- **Two-column grid** (author | time) that stacks on mobile

### Tags

Pill-shaped with cyan borders:

```css
border: 1px solid var(--accent-2);
color: var(--accent-2);
border-radius: 999px;           /* Full pill */
padding: 2px 8px;
font-size: 12px;
```

**Hover**: Fill with cyan, text becomes background color

### Callouts

Three semantic variants with thick left borders:

```css
/* Base */
background: var(--muted-surface);
border: 1px solid var(--hairline);
padding: 16px;
border-radius: var(--radius-1);

/* Variants */
.alert { border-left: 4px solid var(--accent); }       /* Red */
.hypothesis { border-left: 4px solid var(--accent-2); } /* Cyan */
.success { border-left: 4px solid var(--success); }     /* Green */
```

### Buttons

```css
background: var(--accent);          /* Red default */
color: white;
border: none;
border-radius: var(--radius-2);
padding: 10px 16px;
font-weight: 600;
```

**Hover**: `brightness(1.1)` + `translateY(-1px)`
**Secondary variant**: Use `--accent-2` (cyan) background

### Forms

```css
background: var(--muted-surface);
border: 1px solid var(--hairline);
border-radius: var(--radius-2);
padding: 10px 12px;
```

**Focus state**: `outline: 2px solid var(--accent-2)` with 2px offset

## Special Features

### Command Palette

Modal centered at 50%/50%, max-width 600px:

- Border: 2px solid `var(--accent-2)` (cyan)
- Input: Full width, borderless except bottom hairline
- Results: Max 400px height, scrollable
- Overlay: `rgba(0, 0, 0, 0.7)` backdrop at z-index 999

### Section Labels

Small caps headers for widgets/sections:

```css
color: var(--text-2);
font-size: 12px;
letter-spacing: 0.03em;
text-transform: uppercase;
font-weight: 600;
padding-bottom: 12px;
border-bottom: 1px solid var(--hairline);
```

### Pagination

Monospace font, space-between layout:

- Links in bordered boxes with hairline borders
- Arrow indicators: `←` prefix for prev, `→` suffix for next
- Hover: Accent border + muted background

### Link Styling

Default links:

```css
color: var(--accent);
text-decoration: underline;
text-underline-offset: 2px;
```

**Hover**: `text-decoration-thickness: 2px` + `brightness(1.04)`
**Focus**: 2px accent outline with 2px offset

## Key Styling Patterns

1. **Dual accent system**: Red (`--accent`) for posts/primary, Cyan (`--accent-2`) for Lab Notes/secondary
2. **Monospace timestamps**: All dates/metadata use `--font-mono` with `::` red prefix
3. **Hairline borders**: Consistent 1px borders using `--hairline` variable
4. **8pt spacing rhythm**: All margins/padding use `--sp-*` tokens
5. **Subtle animations**: Fast transitions (150-200ms) with lift/brightness effects
6. **Dark-first**: Dark theme is default, light theme is manual toggle
7. **Accessibility**: 2px focus outlines, reduced motion support, semantic HTML

## Minimal HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TalkingScientist Style</title>
  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body class="theme-dark">
  <!-- Add theme-light for light mode -->
  <!-- Add lab-note class for cyan accent variant -->
</body>
</html>
```
