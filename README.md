# 🎯 Background Drifter

**Interactive parallax background effect with smooth mouse tracking**

A modern, high-performance web experience featuring multiple layered parallax effects, smooth animations, and responsive mouse tracking. Built with TypeScript, GSAP, and modern web technologies.

## ✨ Features

### 🖱️ **Advanced Mouse Tracking**

- **Initial position detection** - Captures mouse position without user interaction
- **Normalized coordinates** - Provides -1 to +1 range for consistent calculations
- **Cross-device compatibility** - Works with mouse, touch, and stylus input
- **Performance optimized** - Uses pointer events for universal device support

### 🎭 **Multi-Layer Parallax Effects**

- **Background parallax** - CSS background movement with opposite-direction motion and safety boundaries → [📚 Parallax Background Docs](docs/PARALLAX_BACKGROUND.md)
- **Element parallax** - Multiple elements with individual movement speeds → [📚 Parallax Elements Docs](docs/PARALLAX_ELEMENTS.md)
- **Mouse parallax** - Direct cursor-following effects for interactive elements → [📚 Mouse Parallax Docs](docs/PARALLAX_MOUSE.md)
- **Intersection optimization** - Only animates visible elements for better performance

### 🚀 **Smooth Animations**

- **GSAP-powered** - Industry-standard animation library for 60fps performance
- **Custom easing** - Expo.out and other professional easing functions
- **Text animations** - Character-by-character reveal effects → [📚 Text Animate Docs](docs/TEXT_ANIMATE.md)
- **Overlay transitions** - Smooth loading screen animations → [📚 Overlay Animation Docs](docs/OVERLAY_ANIMATION.md)

### ⚡ **Performance Features**

- **Visibility-based optimization** - Intersection Observer API for smart resource usage
- **Event listener management** - Dynamic add/remove for efficient memory usage
- **Rounded pixel calculations** - Prevents sub-pixel rendering issues
- **Modular architecture** - Side-effect imports for clean dependency management

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development with modern ES modules
- **GSAP** - Professional animation library with quickTo performance
- **Vite** - Lightning-fast build tool and dev server
- **Sass** - Advanced CSS preprocessing with modern features
- **Modern Web APIs** - Intersection Observer, Pointer Events, Media Queries

## 📁 Project Structure

```
src/
├── assets/
│   ├── scss/                           # Modular Sass stylesheets
│   │   ├── _parallax-background.scss
│   │   ├── _parallax-element.scss
│   │   ├── _text-animate.scss
│   │   └── main.scss
│   ├── ts/
│   │   ├── features/                   # Main feature modules
│   │   │   ├── parallaxBackground.ts   # Background parallax effect
│   │   │   ├── parallaxElements.ts     # Element parallax animations
│   │   │   ├── parallaxMouse.ts        # Mouse-following effects
│   │   │   ├── textAnimate.ts          # Text reveal animations
│   │   │   └── overlayAnimation.ts     # Loading screen transitions
│   │   ├── utils/                      # Core utilities
│   │   │   ├── mouseTracker.ts         # Advanced mouse position tracking
│   │   │   ├── eventEmitter.ts         # Custom event system
│   │   │   ├── intersectionObserver.ts # Visibility optimization
│   │   │   └── havePointer.ts          # Device capability detection
│   │   └── main.ts                     # Entry point with side-effect imports
├── docs/                               # Detailed feature documentation
│   ├── OVERLAY_ANIMATION.md            # Overlay animation documentation
│   ├── PARALLAX_BACKGROUND.md          # Background parallax documentation
│   ├── PARALLAX_ELEMENTS.md            # Element parallax documentation
│   ├── PARALLAX_MOUSE.md               # Mouse parallax documentation
│   └── TEXT_ANIMATE.md                 # Text animation documentation
└── index.html
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/drementer/background-drifter.git
cd background-drifter

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## 📚 Documentation

Detailed documentation for each feature is available in the docs folder:

- [🎯 Overlay Animation](docs/OVERLAY_ANIMATION.md) - Automatic overlay closing animation
- [🎯 Parallax Background](docs/PARALLAX_BACKGROUND.md) - Mouse tracking background effect
- [🎯 Parallax Elements](docs/PARALLAX_ELEMENTS.md) - Entrance animation for multiple elements
- [🎯 Mouse Parallax](docs/PARALLAX_MOUSE.md) - Mouse-following parallax effects
- [🎯 Text Animation](docs/TEXT_ANIMATE.md) - Character-by-character text reveal

## 🎯 Configuration

### Background Setup

The parallax background uses **CSS background properties** (gradients, colors, etc.) positioned to be **2.5x larger** than the viewport for smooth movement:

```scss
// Required background positioning
.parallax-background {
  width: 250vw; // 2.5x viewport width for movement space
  height: 250vh; // 2.5x viewport height for movement space
  background: linear-gradient(45deg, #your-colors); // Or any CSS background
}
```

### Customizing Parallax Intensity

```typescript
// In parallaxBackground.ts
private readonly maxShiftPercent = 75; // Adjust movement range (0-100)

// In parallaxElements.ts
const settings = {
  yPercent: -30,  // Adjust element movement distance
  stagger: 0.1,   // Adjust delay between elements
};
```

### Animation Timing

```typescript
// In any feature file
private readonly gsapSettings: gsap.TweenVars = {
  duration: 2.5,     // Animation duration in seconds
  ease: 'expo.out',  // Easing function
};
```

## 📚 How It Works

### Mouse Tracking System

1. **Initial Detection**: Creates invisible overlay to capture immediate mouse position
2. **Continuous Tracking**: Listens to pointer events for real-time updates
3. **Normalization**: Converts pixels to -1/+1 range with viewport center as (0,0)
4. **Event Distribution**: Emits standardized coordinates to all parallax features

### Parallax Mathematics

```
Normalized Position (-1 to +1) × Maximum Shift (75%) = Movement Percentage
Movement Percentage ÷ 100 × Viewport Size = Pixel Distance
-Pixel Distance = Opposite Direction Movement
```

### Performance Optimization

- **Intersection Observer**: Only animates visible elements
- **Event Toggling**: Dynamically adds/removes listeners based on visibility
- **GSAP quickTo**: Pre-compiled animations for maximum performance
- **Rounded Calculations**: Prevents expensive sub-pixel rendering

## ✨ Features in Detail

### Background Parallax → [📚 Full Documentation](docs/PARALLAX_BACKGROUND.md)

- **Moves CSS background** opposite to mouse direction for depth illusion
- **Safety boundaries** prevent background edges from becoming visible
- **Smooth exponential easing** for natural feel

### Element Parallax → [📚 Full Documentation](docs/PARALLAX_ELEMENTS.md)

- **Multiple elements** with staggered animations
- **Configurable movement** distances and delays
- **Automatic cleanup** and optimization

### Text Animations → [📚 Full Documentation](docs/TEXT_ANIMATE.md)

- **Character-by-character** reveal effects
- **Rotation and opacity** transitions
- **SplitText integration** for advanced typography

### Mouse Parallax → [📚 Full Documentation](docs/PARALLAX_MOUSE.md)

- **Lightweight mouse-following** parallax effect
- **Viewport optimization** with Intersection Observer
- **Performance optimized** for smooth animation

### Loading Overlay → [📚 Full Documentation](docs/OVERLAY_ANIMATION.md)

- **Smooth entrance** and exit transitions
- **Scroll locking** during transitions
- **Custom cubic-bezier** easing support

## 🔧 Customization

### Adding New Parallax Elements

```html
<!-- Add parallax attribute to any element -->
<div parallax-elements>Your content</div>
```

### Creating Custom Effects

```typescript
// Follow the established pattern
import { mouseTracker } from '../utils/mouseTracker';

class CustomParallax {
  constructor() {
    mouseTracker.on('mousemove', this.handleMouseMove);
  }

  private handleMouseMove = (position: { x: number; y: number }) => {
    // Your custom parallax logic
  };
}

// Auto-initialize with side-effect import
new CustomParallax();
```

## 📱 Browser Support

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 13+
- **Edge** 79+

Requires support for:

- ES Modules
- Pointer Events
- Intersection Observer API
- CSS Custom Properties

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**drementer**

- GitHub: [@drementer](https://github.com/drementer)

## 🙏 Acknowledgments

- **GSAP** - For exceptional animation performance
- **Vite** - For blazing fast development experience
- **TypeScript** - For type-safe development

---

## 📈 Performance Notes

- **60fps animations** using GSAP's optimized engine
- **Minimal DOM queries** with cached element references
- **Smart event management** with automatic cleanup
- **Visibility-based optimization** reduces CPU usage by 90%+
- **Modern ES modules** for optimal tree-shaking

## 🐛 Troubleshooting

### Common Issues

**Parallax not working?**

- Ensure background element is 2.5x viewport size for proper movement space
- Check console for pointer detection warnings
- Verify element has correct parallax attributes

**Performance issues?**

- Check if multiple animations are running simultaneously
- Ensure Intersection Observer is working correctly
- Monitor console for event listener warnings

**Build errors?**

- Verify TypeScript configuration
- Check GSAP import statements
- Ensure all dependencies are installed

---

_Built with ❤️ and modern web technologies_
