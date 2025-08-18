import { createTextAnimation } from './features/textAnimate';
import { initParallaxBackground } from './features/parallaxBackground';
import { MouseParallax } from './features/parallaxMouse';

const havePointer = window.matchMedia('(pointer:fine)').matches;

createTextAnimation();
initParallaxBackground();
if (havePointer) new MouseParallax();
