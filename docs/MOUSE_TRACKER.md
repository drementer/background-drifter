# 🖱️ Mouse Tracker Utility

Tracks mouse position and converts pixel coordinates to normalized values (-1 to +1) where (0,0) represents the viewport center. Essential for parallax effects and mouse-following animations.

## ✨ How It Works

1. **Initial Detection**: Creates invisible overlay to detect mouse position without user interaction
2. **Continuous Tracking**: Listens to pointermove events for ongoing mouse movement
3. **Coordinate Conversion**: Transforms pixel positions to normalized coordinate system
4. **Event Emission**: Emits 'init' once, then 'mousemove' continuously

## 🔢 Coordinate Transformation

The conversion process transforms screen coordinates to a centered, normalized system:

```javascript
// STEP 1: Pixels to percentage (0 to 1)
const percentageX = mouseX / screenWidth;
const percentageY = mouseY / screenHeight;

// STEP 2: Center the coordinate system (center = 0)
const centeredX = percentageX - 0.5;
const centeredY = percentageY - 0.5;

// STEP 3: Normalize to full range (-1 to +1)
const normalizedX = centeredX * 2;
const normalizedY = centeredY * 2;
```

## 📊 Coordinate Examples

| Mouse Position       | Calculation                     | Normalized Result |
| -------------------- | ------------------------------- | ----------------- |
| Left edge (0px)      | `0/1920 → 0 - 0.5 → -0.5 × 2`   | `-1.0`            |
| Center (960px)       | `960/1920 → 0.5 - 0.5 → 0 × 2`  | `0.0`             |
| Right edge (1920px)  | `1920/1920 → 1 - 0.5 → 0.5 × 2` | `1.0`             |
| Top edge (0px)       | `0/1080 → 0 - 0.5 → -0.5 × 2`   | `-1.0`            |
| Bottom edge (1080px) | `1080/1080 → 1 - 0.5 → 0.5 × 2` | `1.0`             |

## 🎯 Output Coordinate System

```
(-1, -1)     (0, -1)         (1, -1)
┌───────────────┬───────────────┐
│               │               │
(-1, 0)      (0, 0)          (1, 0)
│               │               │
│               │               │
(-1, 1)      (0, 1)          (1, 1)
└───────────────┴───────────────┘
```

Where:

- `(0, 0)` = Viewport center
- `(-1, -1)` = Top-left corner
- `(1, 1)` = Bottom-right corner
- `(-1, 0)` = Left edge center
- `(1, 0)` = Right edge center

## ⚙️ Technical Features

- **Invisible Overlay**: Creates transparent div covering entire viewport for initial detection
- **Pointer Support Check**: Automatically disabled on touch-only devices
- **Memory Management**: Removes overlay after initial detection
- **Precision Control**: Limits coordinates to 2 decimal places
- **Event-Driven**: Uses EventEmitter pattern for loose coupling

## 🔄 Lifecycle Events

1. **'init'**: Emitted once when initial mouse position is detected
2. **'mousemove'**: Emitted continuously as mouse moves across viewport

## 💡 Usage Examples

```typescript
import { mouseTracker } from './mouseTracker';

// Listen for initial position
mouseTracker.on('init', (position) => {
  console.log('Initial mouse position:', position);
  // position = { x: 0.25, y: -0.8 }
});

// Listen for continuous movement
mouseTracker.on('mousemove', (position) => {
  // Update parallax elements
  updateParallax(position.x, position.y);
});
```

## ⚡ Performance Features

- ✅ **Efficient overlay**: Single DOM element for initial detection
- ✅ **Passive listeners**: Uses passive event listeners for smooth scrolling
- ✅ **Timeout fallback**: 1-second timeout ensures initialization even without mouse movement
- ✅ **Memory cleanup**: Overlay automatically removed after use
- ✅ **Precision control**: Prevents floating-point precision issues

## 🚫 Limitations

- Requires pointer support (disabled on touch-only devices)
- Initial detection requires mouse movement or timeout
- Overlay briefly covers entire viewport during initialization

## 🔧 Implementation Details

### Overlay Creation

```typescript
private createInitialTracker(): void {
  this.overlayElement = document.createElement('div');
  this.overlayElement.className = 'mouse-grid-overlay';

  const overlayStyles = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    pointer-events: auto;
    z-index: 99999;
    cursor: default;
    background: transparent;
  `;

  this.overlayElement.style.cssText = overlayStyles;
  document.body.appendChild(this.overlayElement);
}
```

### Event Handling

```typescript
// Initial detection with timeout fallback
setTimeout(returnMousePosition, 1_000);

// Continuous tracking
window.addEventListener('pointermove', calculateAndEmitMousePosition);
```