# 🎯 Text Animation Effect

Creates an elegant character-by-character text reveal animation using GSAP's SplitText plugin.

## ✨ How It Behaves

- **Each character** appears individually with a stagger effect
- **Characters start** invisible, rotated, and offset below
- **Animation flows** from left to right with smooth timing
- **Delayed start** (1 second) for dramatic effect

## 🔧 Animation Settings

| Property    | Value        | Description                                |
| ----------- | ------------ | ------------------------------------------ |
| `autoAlpha` | `0`          | Starts invisible (opacity + visibility)    |
| `yPercent`  | `100%`       | Characters start 100% below their position |
| `rotation`  | `-15°`       | Slight counter-clockwise rotation          |
| `duration`  | `0.55s`      | Animation duration per character           |
| `delay`     | `1s`         | Initial delay before animation starts      |
| `ease`      | `power4.out` | Smooth deceleration curve                  |

## 🌊 Stagger Effect

```javascript
stagger: {
  each: 0.01; // 10ms delay between each character
}
```

**Result:** Characters appear in sequence with minimal delay for smooth flow.

## 📝 Implementation Notes

- **Requires** element with `[text-animate]` attribute
- **Uses** GSAP's `SplitText` plugin to break text into characters
- **Automatically runs** on page load via side-effect import
- **Timeline based** for precise animation control

## 🎯 Target Element

```html
<h1 text-animate>Your animated text here</h1>
```

## 💡 Visual Flow

```
Before: [invisible rotated characters below]
After:  [Y][o][u][r][ ][t][e][x][t] (smooth reveal)
```

Each character smoothly animates from its hidden state to final position with the specified easing and stagger timing.
