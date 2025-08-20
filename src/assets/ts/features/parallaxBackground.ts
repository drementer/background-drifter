import { gsap } from 'gsap';
import { animateParallaxElements } from './parallaxElements';
import { mouseTracker } from '../utils/mouseTracker';
import { intersectionObserver } from '../utils/intersectionObserver';

/**
 * 🎨 PARALLAX MOUSE TRACKING EFFECT
 *
 * WHAT THIS DOES:
 * Creates a smooth parallax effect where the background image subtly moves
 * in the OPPOSITE direction of your mouse cursor. This creates a 3D-like
 * depth effect that makes the page feel more interactive and alive.
 *
 * HOW IT WORKS:
 * - Move mouse LEFT → background moves RIGHT
 * - Move mouse RIGHT → background moves LEFT
 * - Move mouse UP → background moves DOWN
 * - Move mouse DOWN → background moves UP
 * - Mouse in CENTER → background stays STILL
 *
 * THE MATH BEHIND IT:
 * We need to convert mouse pixels into background movement distance.
 * This happens in 2 clear steps:
 *
 * STEP 1: APPLY REAL MOVEMENT DISTANCE
 * Problem: -1 to +1 is just direction, we need actual percent units
 * Solution: Multiply by maxMovement to get real distance
 *
 * EXAMPLES:
 * (with maxMovementX = 75)
 * - Full left (-1.0): -1.0 × 75 = -75% (background moves 75% RIGHT)
 * - Half left (-0.5): -0.5 × 75 = -37.5% (background moves 37.5% RIGHT)
 * - Center (0): 0 × 75 = 0% (background stays still)
 * - Half right (+0.5): +0.5 × 75 = +37.5% (background moves 37.5% LEFT)
 * - Full right (+1.0): +1.0 × 75 = +75% (background moves 75% LEFT)
 * Final range: -75% to +75%
 *
 * STEP 2: CONVERT PERCENT TO PIXELS
 * Convert percent values to pixels for 'quickTo' compatibility
 * Problem: 'quickTo' only accepts pixels, not PERCENT
 * Solution: Convert to pixels using screenWidth/screenHeight
 *
 * FINAL EXAMPLE: Mouse at right edge of 1920px screen
 * Step 1: 1.0 × 75% = 75% (final movement distance)
 * Step 2: 75% × 1920px = 1440px (final movement distance in pixels)
 * Result: Background moves 1440px (75%) to the LEFT (opposite direction)
 */

class ParallaxBackground {
  private readonly backgroundWrapper: HTMLElement;
  private readonly background: HTMLElement;
  private readonly gsapSettings: { duration: number; ease: string };
  private readonly setter: { x: gsap.QuickToFunc; y: gsap.QuickToFunc };
  private readonly maxMovement: number = 75;

  // Target position (where we want the background to be)
  private targetBackgroundX: number = 0;
  private targetBackgroundY: number = 0;

  constructor() {
    this.backgroundWrapper = document.querySelector(
      '[parallax-background-wrapper]'
    ) as HTMLElement;

    this.background = this.backgroundWrapper.querySelector(
      '[parallax-background]'
    ) as HTMLElement;

    this.gsapSettings = {
      duration: 0.75,
      ease: 'power2.out',
    };

    this.setter = {
      x: gsap.quickTo(this.background, 'x', this.gsapSettings),
      y: gsap.quickTo(this.background, 'y', this.gsapSettings),
    };

    if (!this.backgroundWrapper) {
      console.warn(
        "Background element with attribute '[parallax-background-wrapper]' not found!"
      );
      return;
    }

    if (!this.background) {
      console.warn(
        "Background element with attribute '[parallax-background]' not found!"
      );
      return;
    }

    this.init();
  }

  private calculateMovement(
    mouseXPosition: number,
    mouseYPosition: number
  ): void {
    // STEP 1: APPLY REAL MOVEMENT DISTANCE
    const horizontalMovement = mouseXPosition * this.maxMovement;
    const verticalMovement = mouseYPosition * this.maxMovement;

    // STEP 2: CONVERT PERCENT TO PIXELS
    const targetXInPx = (horizontalMovement / 100) * window.innerWidth;
    const targetYInPx = (verticalMovement / 100) * window.innerHeight;

    // Set new target positions (negative for opposite direction effect)
    // Round to whole pixels for smooth animation
    this.targetBackgroundX = -Math.round(targetXInPx);
    this.targetBackgroundY = -Math.round(targetYInPx);
  }

  private animateBackgroundToTarget(): void {
    this.setter.x(this.targetBackgroundX);
    this.setter.y(this.targetBackgroundY);
  }

  private onMouseMove = (): void => {
    const { x, y } = mouseTracker.getMousePosition();

    this.calculateMovement(x, y);
    this.animateBackgroundToTarget();
  };

  private setStartPosition = (position: { x: number; y: number }): void => {
    const { x, y } = position;

    setTimeout(() => {
      this.calculateMovement(x, y);
      this.animateBackgroundToTarget();
    }, 750);
  };

  private watchIntersection = (entry: IntersectionObserverEntry): void => {
    if (entry.isIntersecting) {
      mouseTracker.on('mousemove', this.onMouseMove);
    } else {
      mouseTracker.off('mousemove', this.onMouseMove);
    }
  };

  private init(): void {
    animateParallaxElements();
    mouseTracker.on('init', this.setStartPosition);

    intersectionObserver(this.backgroundWrapper, this.watchIntersection, {
      threshold: 0.1,
    });
  }
}

const createParallaxBackground = () => {
  return new ParallaxBackground();
};

export { createParallaxBackground };
