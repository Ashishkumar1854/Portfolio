# 🎨 DESIGN.md — Ashish Portfolio Design System
> Stitch-inspired, dark-first, editorial aesthetic

---

## Color Tokens

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme surfaces
        'bg-primary':    '#0a0a0f',
        'bg-secondary':  '#111118',
        'bg-card':       '#16161e',
        'bg-elevated':   '#1e1e2a',

        // Borders
        'border-subtle': 'rgba(255,255,255,0.07)',
        'border-active': 'rgba(255,255,255,0.15)',

        // Accents
        'accent-blue':   '#4f8eff',
        'accent-purple': '#a855f7',
        'accent-cyan':   '#22d3ee',
        'accent-green':  '#10b981',
        'accent-amber':  '#f59e0b',

        // Text hierarchy
        'text-primary':   '#f0f0fa',
        'text-secondary': '#9898b0',
        'text-muted':     '#5a5a72',

        // Light theme (toggled via .light class)
        'light-bg':       '#fafafe',
        'light-card':     '#ffffff',
        'light-text':     '#0a0a1a',
        'light-sub':      '#44445a',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],      // Hero headings
        body:    ['DM Sans', 'sans-serif'],   // Body text
        mono:    ['JetBrains Mono', 'monospace'], // Code/badges
      },
      fontSize: {
        'hero':    ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display': ['clamp(1.8rem, 4vw, 3rem)', { lineHeight: '1.1' }],
        'title':   ['clamp(1.2rem, 2.5vw, 1.75rem)', { lineHeight: '1.3' }],
      },
      boxShadow: {
        'card':      '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
        'card-hover':'0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,142,255,0.2)',
        'glow-blue': '0 0 40px rgba(79,142,255,0.3)',
        'glow-purple':'0 0 40px rgba(168,85,247,0.3)',
      },
      backdropBlur: {
        'xs': '4px',
        'glass': '12px',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide-up':   'slideUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'counter':    'counter 2s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

---

## Component Patterns

### Glass Card
```jsx
// Usage: <GlassCard className="...">content</GlassCard>
<div className="
  bg-bg-card/80 backdrop-blur-glass
  border border-border-subtle
  rounded-2xl
  shadow-card hover:shadow-card-hover
  transition-all duration-300
  hover:-translate-y-1
">
```

### Section Heading
```jsx
<div className="mb-16 text-center">
  <span className="text-xs font-mono text-accent-blue tracking-[0.2em] uppercase mb-3 block">
    — {eyebrow} —
  </span>
  <h2 className="font-display text-display text-text-primary">
    {heading}
  </h2>
  <p className="text-text-secondary mt-4 max-w-xl mx-auto">
    {subtext}
  </p>
</div>
```

### Tech Badge
```jsx
<span className="
  font-mono text-xs
  px-3 py-1
  bg-accent-blue/10 text-accent-blue
  border border-accent-blue/20
  rounded-full
">
  {tech}
</span>
```

### Proficiency Bar
```jsx
<div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
    style={{ width: `${proficiency}%`, transition: 'width 1s ease' }}
  />
</div>
```

### Stat Counter Card
```jsx
<div className="bg-bg-card border border-border-subtle rounded-2xl p-6 text-center">
  <div className="text-4xl font-display font-bold text-text-primary mb-1">
    {value}<span className="text-accent-blue">{suffix}</span>
  </div>
  <div className="text-sm text-text-secondary font-mono">{label}</div>
</div>
```

---

## Page Layout Rules

### Max Width & Padding
```css
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
/* Sections: py-24 on desktop, py-16 on mobile */
```

### Navbar
- Height: 64px
- Background: `bg-bg-primary/80 backdrop-blur-glass border-b border-border-subtle`
- Sticky, `position: sticky; top: 0; z-index: 50`
- Mobile: hamburger → full-screen overlay menu

### Hero Background
```css
/* Animated gradient orbs behind hero content */
.hero-bg::before {
  content: '';
  position: absolute;
  top: -20%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(79,142,255,0.15) 0%, transparent 70%);
  filter: blur(60px);
  animation: float 8s ease-in-out infinite;
}
.hero-bg::after {
  /* purple orb, opposite corner */
  background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
  right: -10%; bottom: -20%;
  animation-delay: -4s;
}
```

### Grid Background (optional)
```css
.grid-bg {
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 64px 64px;
}
```

---

## Google Fonts Import (index.html)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Framer Motion Patterns

### Stagger Reveal (use on list items)
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map(i => <motion.div variants={item} key={i.id}>{/* card */}</motion.div>)}
</motion.div>
```

### Page Transition
```jsx
// Wrap each page with:
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.35 }}
>
```

### Hover Card
```jsx
<motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }}>
```

---

## Admin Panel Design

- **Sidebar**: 240px wide, `bg-bg-secondary`, icons + labels
- **Content area**: `bg-bg-primary`, padded container
- **Tables**: dark bg-card, border-subtle rows, status badges
- **Forms**: dark inputs with `border-border-subtle`, focus ring `ring-accent-blue`
- **Buttons**: Primary = `bg-accent-blue text-white`, Danger = `bg-red-500/10 text-red-400 border border-red-500/30`

### Status Badges
```jsx
const statusStyles = {
  pending:   'bg-amber-500/10  text-amber-400  border-amber-500/30',
  confirmed: 'bg-green-500/10  text-green-400  border-green-500/30',
  rejected:  'bg-red-500/10    text-red-400    border-red-500/30',
};
<span className={`text-xs font-mono px-2 py-1 rounded border ${statusStyles[status]}`}>
  {status.toUpperCase()}
</span>
```

---

## Responsive Breakpoints (Tailwind defaults)
```
sm:  640px   (large phone landscape)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
```

Key responsive rules:
- Hero heading: `text-3xl md:text-5xl lg:text-hero`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Sidebar: hidden on mobile, slide-in drawer on `md:`, fixed on `lg:`
- Navbar: hamburger on `< md`, full links on `md:`

---

*Reference this file throughout all phases for consistent design tokens.*
