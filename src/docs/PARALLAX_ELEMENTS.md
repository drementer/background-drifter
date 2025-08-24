# 🎯 Parallax Elements Animation

Creates a dramatic entrance animation for multiple elements with random stagger timing and bounce effect.

## ✨ How It Behaves

- **Elements start** small (50% scale) and invisible
- **Animate to** full size with bounce effect
- **Random stagger** creates organic, natural appearance
- **Delayed start** (1 second) for dramatic timing

## 🎨 Animation Settings

| Property   | Value         | Description                           |
| ---------- | ------------- | ------------------------------------- |
| `scale`    | `0.5` → `1.0` | Elements start at 50% size            |
| `opacity`  | `0` → `1.0`   | Fade in from invisible                |
| `duration` | `0.75s`       | Animation duration per element        |
| `ease`     | `back.out`    | Bounce/overshoot effect               |
| `delay`    | `1s`          | Initial delay before animation starts |

## 🎲 Random Stagger Effect

```javascript
stagger: {
  from: 'random',    // Random order (not sequential)
  amount: 1          // Total 1 second spread across all elements
}
```

**Result:** Elements appear in unpredictable order over 1 second duration.

## 📊 Stagger Example

For **4 elements** with `amount: 1`:

```
Element A: starts at 1.0s + random(0-1s) = 1.3s
Element B: starts at 1.0s + random(0-1s) = 1.7s
Element C: starts at 1.0s + random(0-1s) = 1.1s
Element D: starts at 1.0s + random(0-1s) = 1.9s
```

## 🎯 Target Elements

```html
<div parallax-element-wrapper>Element 1</div>
<div parallax-element-wrapper>Element 2</div>
<div parallax-element-wrapper>Element 3</div>
```

## 💡 Visual Effect

```
Before: [invisible 50% scale elements]
After:  [full size bouncy elements appearing randomly]
```

## 🚀 Implementation Notes

- **Queries all** elements with `[parallax-element-wrapper]` attribute
- **Single animation** - runs once on page load
- **Auto-initializes** via side-effect import pattern
- **Graceful handling** - ignores if no elements found