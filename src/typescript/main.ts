/**
 * GSAP type import for TypeScript support
 * Used when GSAP is loaded globally via CDN
 */
import type { gsap as GSAPType } from 'gsap';
declare const gsap: typeof GSAPType;

import './features/textAnimate';
import './features/parallaxBackground';
import './features/parallaxMouse';
import './features/overlayAnimation';
import './features/parallaxElements';
