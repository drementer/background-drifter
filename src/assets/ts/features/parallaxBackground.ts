import { gsap } from 'gsap';
import { animateParallaxElements } from './parallaxElements';
import { mouseTracker } from '../utils/mouseTracker';
import { intersectionObserver } from '../utils/intersectionObserver';

/**
 * Parallax Background effect.
 * See docs: /docs/PARALLAX_BACKGROUND.md
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
