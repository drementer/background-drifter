import { createTextAnimation } from './features/textAnimate';
import { createParallaxBackground } from './features/parallaxBackground';
import { createMouseParallax } from './features/parallaxMouse';
import { hideOverlay } from './features/overlayAnimation';

createTextAnimation();
createParallaxBackground();
createMouseParallax();
hideOverlay();
