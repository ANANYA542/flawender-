# Flawender Animation & Interaction Guide

## Animation Philosophy

The Flawender redesign uses **subtle, purposeful animations** that enhance user experience without being distracting. All animations follow these principles:

1. **Performance First**: CSS-only animations for 60fps performance
2. **Meaningful Motion**: Every animation serves a purpose
3. **Consistent Timing**: Standardized durations and easing
4. **Accessibility**: Respects user preferences for reduced motion

## Timing Variables

### Duration
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Easing Curve
- **cubic-bezier(0.4, 0, 0.2, 1)**: Material Design standard easing
- Creates natural, smooth motion
- Accelerates quickly, decelerates smoothly

## Core Animations

### 1. Fade In
**Usage**: Page loads, modal appearances, content reveals

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Apply */
.element {
  animation: fadeIn 0.6s ease-in-out;
}
```

**Where Used**:
- Dashboard grid
- Feature cards
- Leaderboard items

---

### 2. Slide Up
**Usage**: Content entering from bottom, message animations

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply */
.element {
  animation: slideUp 0.6s ease-out;
}
```

**Where Used**:
- Chat messages
- Button containers
- Card reveals

---

### 3. Scale In
**Usage**: Modal dialogs, popups, emphasis

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Apply */
.element {
  animation: scaleIn 0.4s ease-out;
}
```

**Where Used**:
- Authentication dialog
- Tooltips
- Dropdown menus

---

### 4. Fade In Down
**Usage**: Header elements, top navigation

```css
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply */
.element {
  animation: fadeInDown 1.2s ease-out;
}
```

**Where Used**:
- Flawender heading
- Page titles

---

### 5. Fade In Right
**Usage**: Side navigation, user profile

```css
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Apply */
.element {
  animation: fadeInRight 0.8s ease-out;
}
```

**Where Used**:
- User info panel
- Side menus

---

### 6. Bounce In
**Usage**: Playful elements, rank badges

```css
@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Apply */
.element {
  animation: bounceIn 0.6s ease-out;
}
```

**Where Used**:
- Leaderboard rank badges
- Achievement icons

---

### 7. Blink
**Usage**: Cursor effect, attention grabbers

```css
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* Apply */
.cursor {
  animation: blink 1s infinite;
}
```

**Where Used**:
- Typewriter cursor
- Loading indicators

## Hover Effects

### 1. Lift Effect
**Usage**: Cards, buttons, interactive elements

```css
.card {
  transition: all var(--transition-base);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

**Intensity Levels**:
- **Subtle**: `-2px` (small buttons)
- **Standard**: `-4px` (cards)
- **Prominent**: `-8px` (feature cards)

---

### 2. Scale Effect
**Usage**: Icons, small interactive elements

```css
.icon {
  transition: transform var(--transition-fast);
}

.icon:hover {
  transform: scale(1.15);
}
```

**Scale Factors**:
- **Subtle**: `1.05` (buttons)
- **Standard**: `1.15` (icons)
- **Prominent**: `1.2` (like buttons)

---

### 3. Border Animation
**Usage**: Cards, containers

```css
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-warm), var(--accent-gold));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
}

.card:hover::before {
  transform: scaleX(1);
}
```

**Where Used**:
- Idea cards
- Feature cards
- Leaderboard items

---

### 4. Ripple Effect
**Usage**: Buttons with expanding background

```css
.button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--accent-warm);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
  z-index: -1;
}

.button:hover::before {
  width: 300px;
  height: 300px;
}
```

**Where Used**:
- Primary buttons on home page
- Call-to-action buttons

---

### 5. Glow Effect
**Usage**: Focus states, active elements

```css
.input:focus {
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
  border-color: var(--accent-warm);
}
```

**Glow Intensities**:
- **Subtle**: `0 0 0 3px rgba(..., 0.1)`
- **Medium**: `0 0 0 4px rgba(..., 0.15)`
- **Strong**: `0 0 0 5px rgba(..., 0.2)`

## Loading States

### 1. Skeleton Screens
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--beige-200) 0%,
    var(--beige-300) 50%,
    var(--beige-200) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### 2. Spinner
```css
.spinner {
  border: 3px solid var(--beige-200);
  border-top-color: var(--accent-warm);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

## Interaction Patterns

### Button States

#### Primary Button
```css
/* Default */
background: linear-gradient(135deg, var(--accent-warm), var(--accent-gold));
box-shadow: var(--shadow-md);

/* Hover */
transform: translateY(-2px);
box-shadow: var(--shadow-lg);

/* Active */
transform: translateY(0);
box-shadow: var(--shadow-sm);

/* Focus */
outline: 2px solid var(--accent-warm);
outline-offset: 2px;
```

#### Secondary Button
```css
/* Default */
background: var(--neutral-white);
border: 2px solid var(--beige-400);

/* Hover */
border-color: var(--accent-warm);
transform: translateY(-1px);

/* Active */
background: var(--beige-100);
```

### Card Interactions

#### Idea Card
```css
/* Default */
border: 1.5px solid var(--beige-300);
box-shadow: var(--shadow-sm);

/* Hover */
transform: translateY(-4px);
box-shadow: var(--shadow-lg);
border-color: var(--accent-warm);

/* Top border animation */
.card::before {
  transform: scaleX(1); /* from scaleX(0) */
}
```

### Input Focus States

```css
/* Default */
border: 2px solid var(--beige-300);
background: var(--beige-50);

/* Focus */
border-color: var(--accent-warm);
background: var(--neutral-white);
box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
```

## Stagger Animations

For lists of items (like feature cards):

```css
.feature-card {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.feature-card:nth-child(1) { animation-delay: 0s; }
.feature-card:nth-child(2) { animation-delay: 0.1s; }
.feature-card:nth-child(3) { animation-delay: 0.2s; }
.feature-card:nth-child(4) { animation-delay: 0.3s; }
```

## Micro-interactions

### Like Button
```css
.like-button {
  transition: all var(--transition-fast);
}

.like-button:hover {
  transform: scale(1.15);
  filter: brightness(1.2);
}

.like-button.liked {
  color: var(--error);
  animation: heartBeat 0.3s ease;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
```

### Close Button
```css
.close-button {
  transition: all var(--transition-base);
}

.close-button:hover {
  background-color: var(--beige-300);
  transform: rotate(90deg);
}
```

## Performance Tips

1. **Use `transform` and `opacity`**: These properties are GPU-accelerated
2. **Avoid animating**: `width`, `height`, `top`, `left` (causes reflow)
3. **Use `will-change` sparingly**: Only for complex animations
4. **Prefer CSS over JavaScript**: Better performance and smoother animations

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Indicators
Always provide visible focus states for keyboard navigation:
```css
button:focus-visible {
  outline: 2px solid var(--accent-warm);
  outline-offset: 2px;
}
```

## Animation Checklist

- [ ] Animation serves a purpose (not decorative)
- [ ] Duration is appropriate (150-600ms for most)
- [ ] Easing feels natural
- [ ] Performance is smooth (60fps)
- [ ] Respects reduced motion preferences
- [ ] Focus states are visible
- [ ] Works on all target devices
