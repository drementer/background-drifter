# 🎯 Parallax Mouse Tracking Effect

Creates a smooth parallax effect where the background moves in the **OPPOSITE** direction of your mouse cursor, creating a 3D-like depth effect.

## ✨ How It Behaves

- **Move mouse LEFT** → background moves **RIGHT**
- **Move mouse RIGHT** → background moves **LEFT**
- **Move mouse UP** → background moves **DOWN**
- **Move mouse DOWN** → background moves **UP**
- **Mouse in CENTER** → background stays **STILL**

## 🔢 The Math

```
Mouse position (-1 to +1) × Maximum allowed shift (75%) = Movement percentage
```

## 🤔 Why 75% Maximum?

- Background is **2.5x bigger** than viewport
- Extra space: `250% - 100% = 150%`
- Split equally: `150% ÷ 2 = 75%` per side
- This **prevents edge visibility** during movement

## 📊 Examples

| Mouse Position      | Calculation           | Result                       |
| ------------------- | --------------------- | ---------------------------- |
| Center (0)          | `0 × 75% = 0%`        | No movement                  |
| Halfway right (0.5) | `0.5 × 75% = 37.5%`   | Background moves 37.5% LEFT  |
| Fully right (1.0)   | `1.0 × 75% = 75%`     | Background moves 75% LEFT    |
| Halfway left (-0.5) | `-0.5 × 75% = -37.5%` | Background moves 37.5% RIGHT |

## 🔄 Conversion Process

1. **Get** normalized mouse position (-1 to +1)
2. **Scale** by maximum shift percentage (75%)
3. **Convert** percentage to pixels for GSAP
4. **Apply** opposite direction for parallax effect

## 💡 Example Calculation

**Mouse at 40% right (0.4) on 1920px screen:**

```
0.4 × 75% = 30% movement
30% × 1920px = 576px
Background moves 576px to the LEFT
```

## 🛠️ Implementation Notes

- Uses `gsap.quickTo()` for smooth 60fps animation
- Requires normalized mouse coordinates from `MouseTracker`
- Intersection Observer for performance optimization
- Auto-initializes via side-effect import pattern
