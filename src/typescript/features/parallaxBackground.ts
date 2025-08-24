import type { gsap as GSAPType } from 'gsap';

// Global GSAP object from CDN
declare const gsap: typeof GSAPType;
import { mouseTracker } from '../utils/mouseTracker';
import { intersectionObserver } from '../utils/intersectionObserver';
import { havePointer } from '../utils/havePointer';

/**
 * Parallax Background effect.
 * See docs: docs/PARALLAX_BACKGROUND.md
 */

class ParallaxBackground {
  private readonly maxShiftPercent = 75;
  private readonly gsapSettings: gsap.TweenVars = {
    duration: 2.5,
    ease: 'expo.out',
  };

  private readonly backgroundWrapper = document.querySelector(
    '[parallax-background-wrapper]'
  );
  private readonly background = this.backgroundWrapper?.querySelector(
    '[parallax-background]'
  );

  private setter: { x: gsap.QuickToFunc; y: gsap.QuickToFunc } | undefined;

  private targetBackgroundX = 0;
  private targetBackgroundY = 0;

  constructor() {
    if (!this.background) {
      console.warn('No background element found');
      return;
    }

    this.setter = {
      x: gsap.quickTo(this.background, 'x', this.gsapSettings),
      y: gsap.quickTo(this.background, 'y', this.gsapSettings),
    };
    this.init();
  }

  private calculateMovement(
    mouseXPosition: number,
    mouseYPosition: number
  ): void {
    // Scale normalized position (-1 to +1) by maximum allowed shift (75%)
    const horizontalMovement = mouseXPosition * this.maxShiftPercent;
    const verticalMovement = mouseYPosition * this.maxShiftPercent;

    // Convert movement percentage to actual pixels for GSAP
    const targetXInPx = (horizontalMovement / 100) * window.innerWidth;
    const targetYInPx = (verticalMovement / 100) * window.innerHeight;

    // Apply opposite direction for parallax effect + round for smooth animation
    this.targetBackgroundX = -Math.round(targetXInPx);
    this.targetBackgroundY = -Math.round(targetYInPx);
  }

  private animateBackgroundToTarget(): void {
    this.setter?.x(this.targetBackgroundX);
    this.setter?.y(this.targetBackgroundY);
  }

  private onMouseMove = ({ x, y }: { x: number; y: number }): void => {
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

  private watchIntersection = (): void => {
    mouseTracker.toggle('mousemove', this.onMouseMove);
  };

  private init(): void {
    mouseTracker.on('init', this.setStartPosition);

    if (!havePointer) return console.warn('Pointer not found');
    if (!this.backgroundWrapper) {
      return console.warn('Parallax background wrapper not found');
    }

    intersectionObserver(this.backgroundWrapper, this.watchIntersection);
  }
}

new ParallaxBackground();
