# 🎯 Overlay Animation Effect

Creates an automatic overlay closing animation that slides the overlay upward on page load and manages page scroll behavior.

## ✨ How It Behaves

- **Runs automatically** on page load (0.25s delay)
- **Overlay slides UP** out of view (`y: -100%`)
- **Page scroll locks** during animation
- **Scroll unlocks** when animation completes
- **Element hidden** after animation finishes

## ⚙️ Animation Settings

| Property   | Value       | Description                                |
| ---------- | ----------- | ------------------------------------------ |
| `y`        | `-100%`     | Moves overlay completely upward            |
| `ease`     | `power3.in` | Accelerating ease (starts slow, ends fast) |
| `duration` | `0.75s`     | Animation duration                         |
| `delay`    | `0.25s`     | Short delay before starting                |

## 🔒 Scroll Management

### onStart Callback

```javascript
onStart: () => lockPageScroll(true);
```

- **Prevents scrolling** during animation
- **Adds** `-scroll-lock` class to `<html>` element

### onComplete Callback

```javascript
onComplete: () => {
  lockPageScroll(false); // Unlock scroll
  setTimeout(() => (element.hidden = true), 100); // Hide element
};
```

## 🎯 Target Element

```html
<div open-overlay>Your overlay content</div>
```

## 🔄 Animation Flow

```
1. Page loads → Animation starts automatically
2. Page scroll LOCKS
3. Overlay slides UP (0.75s)
4. Page scroll UNLOCKS
5. Element becomes hidden (after 100ms)
```

## 💡 Implementation Notes

- **Auto-executes** via IIFE pattern on page load
- **Handles missing elements** gracefully with console warning
- **Side-effect import** - runs immediately when imported
- **Single-use animation** - designed for initial overlay closing