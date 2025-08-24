# 🎯 Mouse Parallax Effect

Creates a lightweight mouse-following parallax effect for multiple elements with viewport optimization.

## ✨ How It Behaves

- **Elements follow** mouse movement with smooth animation
- **Only animates** elements currently visible in viewport
- **Performance optimized** with Intersection Observer
- **Subtle movement** for elegant user interaction

## 🔢 Movement Calculation

```javascript
const xMovement = mouseX * 20; // Mouse position × 20px
const yMovement = mouseY * 20; // Mouse position × 20px
```

## 📊 Movement Examples

| Mouse Position    | Calculation       | Element Movement |
| ----------------- | ----------------- | ---------------- |
| Center (0, 0)     | `0 × 20 = 0px`    | No movement      |
| Right edge (1, 0) | `1 × 20 = 20px`   | 20px right       |
| Left edge (-1, 0) | `-1 × 20 = -20px` | 20px left        |
| Top edge (0, -1)  | `0 × -20 = -20px` | 20px up          |

## ⚙️ Animation Settings

| Property   | Value            | Description               |
| ---------- | ---------------- | ------------------------- |
| `duration` | `2.5s`           | Smooth, slow following    |
| `ease`     | `expo.out`       | Natural deceleration      |
| **Method** | `gsap.quickTo()` | 60fps optimized animation |

## 🎯 Target Elements

```html
<div mouse-parallax>Follows mouse</div>
<img mouse-parallax src="image.jpg" alt="Parallax image" />
<section mouse-parallax>Any element works</section>
```

## 🔍 Viewport Optimization

### Intersection Observer Logic

```javascript
if (entry.isIntersecting) {
  visibleElements.add(element); // Start tracking
} else {
  visibleElements.delete(element); // Stop tracking
}
```

**Performance Benefit:** Only elements in viewport consume animation resources.

## 🔄 Lifecycle

1. **Page loads** → Scan for `[mouse-parallax]` elements
2. **Setup observers** → Monitor each element's visibility
3. **Mouse moves** → Calculate movement for visible elements only
4. **Elements animate** → Smooth following with `gsap.quickTo()`

## 💡 Implementation Notes

- **Requires pointer support** - automatically disabled on touch-only devices
- **Class-based architecture** for multiple element management
- **Side-effect import** - auto-initializes when imported
- **Memory efficient** - maintains sets of visible elements

## ⚡ Performance Features

- ✅ **Viewport detection** - only animates visible elements
- ✅ **`gsap.quickTo()`** - optimized 60fps animation
- ✅ **Pointer detection** - disabled on non-pointer devices
- ✅ **Memory management** - efficient element tracking
