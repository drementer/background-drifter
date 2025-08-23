import { gsap } from 'gsap';
import { animateParallaxElements } from './parallaxElements';
import { mouseTracker } from '../utils/mouseTracker';
import { intersectionObserver } from '../utils/intersectionObserver';

/**
 * 🎨 PARALLAX MOUSE TRACKING EFFECT
 *
 * Creates a smooth parallax effect where the background moves in the
 * OPPOSITE direction of your mouse cursor, creating a 3D-like depth effect.
 *
 * ✨ HOW IT BEHAVES:
 * • Move mouse LEFT → background moves RIGHT
 * • Move mouse RIGHT → background moves LEFT
 * • Move mouse UP → background moves DOWN
 * • Move mouse DOWN → background moves UP
 * • Mouse in CENTER → background stays STILL
 *
 * 🔢 THE MATH:
 * Mouse position (-1 to +1) × Maximum allowed shift (75%) = Movement percentage
 *
 * 🤔 WHY 75% MAXIMUM?
 * • Background is 2.5x bigger than viewport
 * • Extra space: 250% - 100% = 150%
 * • Split equally: 150% ÷ 2 = 75% per side
 * • This prevents edge visibility during movement
 *
 * 📊 EXAMPLES:
 * • Mouse at center (0): 0 × 75% = 0% → No movement
 * • Mouse halfway right (0.5): 0.5 × 75% = 37.5% → Background moves 37.5% LEFT
 * • Mouse fully right (1.0): 1.0 × 75% = 75% → Background moves 75% LEFT
 * • Mouse halfway left (-0.5): -0.5 × 75% = -37.5% → Background moves 37.5% RIGHT
 *
 * 🔄 CONVERSION PROCESS:
 * 1. Get normalized mouse position (-1 to +1)
 * 2. Scale by maximum shift percentage (75%)
 * 3. Convert percentage to pixels for GSAP
 * 4. Apply opposite direction for parallax effect
 *
 * 💡 EXAMPLE CALCULATION:
 * Mouse at 40% right (0.4) on 1920px screen:
 * • 0.4 × 75% = 30% movement
 * • 30% × 1920px = 576px
 * • Background moves 576px to the LEFT
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

new ParallaxBackground();
