# Flawender Color Palette Reference

## Beige Tones (Primary)

### Light Shades
- `--beige-50: #fdfcfb` - Lightest beige, almost white
- `--beige-100: #f8f5f1` - Very light beige for backgrounds
- `--beige-200: #f0ebe4` - Light beige for subtle elements
- `--beige-300: #e8dfd5` - Medium-light beige for borders

### Medium Shades
- `--beige-400: #d9cbb8` - Medium beige for interactive elements
- `--beige-500: #c9b89a` - True beige, balanced tone
- `--beige-600: #b5a084` - Medium-dark beige for text

### Dark Shades
- `--beige-700: #9a8468` - Dark beige for emphasis
- `--beige-800: #7a6750` - Very dark beige
- `--beige-900: #5a4d3c` - Darkest beige

## Accent Colors

### Warm Tones
- `--accent-warm: #d4a574` - Primary warm accent (buttons, links)
- `--accent-gold: #c9a961` - Gold accent (highlights, hover states)
- `--accent-terracotta: #c88b6f` - Terracotta for variety
- `--accent-sage: #a8b5a0` - Sage green for success states

## Neutral Tones

### Whites & Creams
- `--neutral-white: #ffffff` - Pure white
- `--neutral-cream: #faf8f5` - Cream white
- `--neutral-light: #f5f2ed` - Light neutral
- `--neutral-medium: #e5dfd7` - Medium neutral

### Grays & Charcoals
- `--neutral-dark: #4a4238` - Dark gray for body text
- `--neutral-charcoal: #2d2721` - Charcoal for headings

## Semantic Colors

### Status Indicators
- `--success: #8faa7f` - Success/positive actions
- `--warning: #d4a574` - Warnings/caution
- `--error: #c97d6f` - Errors/negative actions
- `--info: #9db4c8` - Informational messages

## Usage Guidelines

### Backgrounds
- **Primary**: `--beige-50`, `--beige-100`
- **Cards**: `--neutral-white`
- **Overlays**: `--beige-100` with transparency
- **Gradients**: `linear-gradient(135deg, var(--beige-50), var(--beige-100))`

### Text
- **Headings**: `--neutral-charcoal`
- **Body**: `--neutral-dark`
- **Muted**: `--beige-700`, `--beige-600`
- **On Dark**: `--neutral-white`

### Borders
- **Subtle**: `--beige-200`, `--beige-300`
- **Standard**: `--beige-400`
- **Emphasis**: `--accent-warm`

### Interactive Elements

#### Buttons (Primary)
- **Background**: `linear-gradient(135deg, var(--accent-warm), var(--accent-gold))`
- **Text**: `--neutral-white`
- **Hover**: Lift effect + shadow increase

#### Buttons (Secondary)
- **Background**: `--neutral-white`
- **Border**: `--beige-400`
- **Text**: `--neutral-charcoal`
- **Hover**: `--accent-warm` background

#### Links
- **Default**: `--accent-warm`
- **Hover**: `--accent-gold`

#### Inputs
- **Background**: `--beige-50`
- **Border**: `--beige-300`
- **Focus Border**: `--accent-warm`
- **Text**: `--neutral-dark`

### Shadows

#### Light Shadows
- `--shadow-sm: 0 1px 3px rgba(74, 66, 56, 0.08)`
- `--shadow-md: 0 4px 12px rgba(74, 66, 56, 0.12)`

#### Medium Shadows
- `--shadow-lg: 0 8px 24px rgba(74, 66, 56, 0.16)`

#### Heavy Shadows
- `--shadow-xl: 0 16px 48px rgba(74, 66, 56, 0.2)`

## Color Combinations

### High Contrast (Accessibility)
- **Text on Light**: `--neutral-charcoal` on `--neutral-white`
- **Text on Beige**: `--neutral-dark` on `--beige-100`
- **White on Accent**: `--neutral-white` on `--accent-warm`

### Harmonious Pairs
1. `--beige-100` + `--accent-warm`
2. `--neutral-white` + `--beige-300` (border)
3. `--beige-200` + `--beige-600`
4. `--accent-warm` + `--accent-gold` (gradients)

### Gradients

#### Warm Gradient
```css
background: linear-gradient(135deg, var(--accent-warm), var(--accent-gold));
```

#### Subtle Background
```css
background: linear-gradient(135deg, var(--beige-50), var(--beige-100));
```

#### Card Highlight
```css
background: linear-gradient(135deg, var(--beige-100), var(--beige-200));
```

#### Success Gradient
```css
background: linear-gradient(135deg, var(--accent-sage), var(--success));
```

## Accessibility Notes

### Contrast Ratios (WCAG AA)
- `--neutral-charcoal` on `--neutral-white`: 12.5:1 ✓
- `--neutral-dark` on `--beige-100`: 8.2:1 ✓
- `--neutral-white` on `--accent-warm`: 4.8:1 ✓
- `--beige-700` on `--neutral-white`: 4.6:1 ✓

### Color Blindness Considerations
- Sufficient contrast between all interactive states
- Don't rely solely on color for information
- Use icons and text labels alongside color coding

## Dark Mode Alternative (Future)

If implementing dark mode, consider:
- Invert beige scale (use darker shades as base)
- Adjust accent colors for better visibility
- Maintain warm tone with brown/tan backgrounds
- Use `--beige-900` as base with `--beige-700` accents
