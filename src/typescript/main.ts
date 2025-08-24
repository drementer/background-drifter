/**
 * This module sets up TypeScript type safety for GSAP when it's loaded globally
 * via CDN or script tag rather than as an npm package.
 */
import type { gsap } from 'gsap';

import './features/textAnimate';
import './features/parallaxBackground';
import './features/parallaxMouse';
import './features/overlayAnimation';
import './features/parallaxElements';
