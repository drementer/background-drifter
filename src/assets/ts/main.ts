import { createTextAnimation } from './textAnimate';
import { initParallaxBackground } from './parallaxBackground';
import { MouseParallax } from './parallaxMouse';

const havePointer = window.matchMedia('(pointer:fine)').matches;

createTextAnimation();
initParallaxBackground();
if (havePointer) new MouseParallax();
