import { gsap } from 'gsap';
import { animateParallaxElements } from './parallaxElements';
import { mouseTracker } from '../utils/mouseTracker';
import { observer } from '../utils/observer';

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
 * This happens in 3 clear steps:
 *
 * Step 1: CENTERING (Make middle = zero)
 * Step 2: NORMALIZING (Scale to -1 and +1 range)
 * Step 3: SCALING (Apply real movement distance in vw/vh units)
 * Step 4: CONVERT VW/VH TO PIXELS (For 'quickTo' compatibility)
 *
 * EXAMPLE: Mouse at right edge of 1920px screen
 * Step 1: 1920/1920 = 1.0 → 1.0 - 0.5 = 0.5 (centered)
 * Step 2: 0.5 × 2 = 1.0 (normalized to full range)
 * Step 3: 1.0 × 75 = 75vw (final movement distance)
 * Step 4: 75vw/100 × 1920px = 1440px (final movement distance in pixels)
 * Result: Background moves 1440px (75vw) to the LEFT (opposite direction)
 */

const backgroundWrapper = document.querySelector(
  '[parallax-background-wrapper]'
) as HTMLElement;
const background = backgroundWrapper?.querySelector(
  '[parallax-background]'
) as HTMLElement;

if (!backgroundWrapper) {
  throw new Error(
    "Background element with attribute '[parallax-section]' not found!"
  );
}

const gsapSettings = {
  duration: 0.75,
  ease: 'power2.out',
};

const setter = {
  x: gsap.quickTo(background, 'x', gsapSettings),
  y: gsap.quickTo(background, 'y', gsapSettings),
};

// Target position (where we want the background to be)
let targetBackgroundX: number = 0;
let targetBackgroundY: number = 0;

const maxMovement = 75;

/**
 * Calculates the background movement based on mouse position
 * @param mouseXPosition - X coordinate of mouse in pixels
 * @param mouseYPosition - Y coordinate of mouse in pixels
 */
const calculateMovement = (
  mouseXPosition: number,
  mouseYPosition: number
): void => {
  /**
   * STEP 1: APPLY REAL MOVEMENT DISTANCE
   *
   * Problem: -1 to +1 is just direction, we need actual pixels/viewport units
   * Solution: Multiply by maxMovement to get real distance
   *
   * Examples (with maxMovementX = 75vw):
   * - Full left (-1.0): -1.0 × 75 = -75vw (background moves 75vw RIGHT)
   * - Half left (-0.5): -0.5 × 75 = -37.5vw (background moves 37.5vw RIGHT)
   * - Center (0): 0 × 75 = 0vw (background stays still)
   * - Half right (+0.5): +0.5 × 75 = +37.5vw (background moves 37.5vw LEFT)
   * - Full right (+1.0): +1.0 × 75 = +75vw (background moves 75vw LEFT)
   *
   * Final range: -75vw to +75vw
   */
  const horizontalMovement = mouseXPosition * maxMovement;
  const verticalMovement = mouseYPosition * maxMovement;

  /**
   * STEP 2: CONVERT VW/VH TO PIXELS
   *
   * Convert vw/vh values to pixels for 'quickTo' compatibility
   * Problem: 'quickTo' only accepts pixels, not vw/vh
   * Solution: Convert to pixels using screenWidth/screenHeight
   */
  const targetXInPx = (horizontalMovement / 100) * window.innerWidth;
  const targetYInPx = (verticalMovement / 100) * window.innerHeight;

  // Set new target positions (negative for opposite direction effect)
  targetBackgroundX = -targetXInPx;
  targetBackgroundY = -targetYInPx;
};

/**
 * Animates background to target position using GSAP
 * Converts vw/vh values to pixels for quickTo compatibility
 */
const animateBackgroundToTarget = (): void => {
  setter.x(targetBackgroundX);
  setter.y(targetBackgroundY);
};

/**
 * Handles mouse movement events and triggers background animation
 */
const onMouseMove = (): void => {
  const { x, y } = mouseTracker.getMousePosition();

  calculateMovement(x, y);
  animateBackgroundToTarget();
};

const setStartPosition = async (position: {
  x: number;
  y: number;
}): Promise<void> => {
  const { x, y } = position;

  setTimeout(() => {
    calculateMovement(x, y);
    animateBackgroundToTarget();
  }, 750);
};

const watchIntersection = (entry: IntersectionObserverEntry) => {
  if (entry.isIntersecting) {
    mouseTracker.on('mousemove', onMouseMove);
  } else {
    mouseTracker.off('mousemove', onMouseMove);
  }
};

const initParallaxBackground = async () => {
  animateParallaxElements();
  mouseTracker.on('init', setStartPosition);

  observer(backgroundWrapper, watchIntersection, { threshold: 0.1 });
};

export { initParallaxBackground };
