import { EventEmitter } from './eventEmitter';

/**
 * 🖱️ MOUSE TRACKER — Initial + Active Tracking
 *
 * PURPOSE:
 * 1. Detect the initial mouse position on page load (without user interaction)
 * 2. Continuously track the active mouse position and emit updates
 *
 * WHY:
 * Browsers do not expose the cursor position until the user interacts with the page.
 * This module ensures we obtain an initial position as soon as possible and then keep
 * tracking changes efficiently.
 *
 * HOW:
 * 1) Initial detection:
 *    - Create a transparent full-viewport overlay element
 *    - Since the mouse cursor is already positioned somewhere on the page,
 *      the overlay will immediately trigger a 'mouseenter' event
 *    - This gives us the mouse position without waiting for user movement
 *    - Capture coordinates, emit 'init', then remove overlay and cleanup
 * 2) Active tracking:
 *    - Listen to 'pointermove' on window for ongoing position updates
 *    - Calculate normalized coordinates and emit 'mousemove' events
 *
 * OUTPUT:
 * Normalized coordinates in range [-1, 1] for both x and y,
 * where (0, 0) is the viewport center.
 *
 * THE MATH (3 Steps to Convert Pixels to Normalized Coordinates):
 *
 * STEP 1: PIXEL TO PERCENTAGE
 * Convert mouse coordinates from pixels to percentages (0 to 1 range)
 * - Formula: x/screenWidth, y/screenHeight
 * - Result: 0 = left/top edge, 0.5 = center, 1 = right/bottom edge
 *
 * STEP 2: CENTER THE COORDINATE SYSTEM
 * Shift coordinate system so center becomes (0,0) instead of (0.5,0.5)
 * - Formula: percentage - 0.5
 * - Result: -0.5 = left/top edge, 0 = center, +0.5 = right/bottom edge
 *
 * STEP 3: NORMALIZE TO FULL RANGE
 * Expand from half-range (-0.5 to +0.5) to full range (-1 to +1)
 * - Formula: centered × 2
 * - Result: -1 = left/top edge, 0 = center, +1 = right/bottom edge
 *
 * Example (1920px width, mouse at right edge):
 * Step 1: 1920/1920 = 1.0
 * Step 2: 1.0 - 0.5 = 0.5
 * Step 3: 0.5 × 2 = 1.0 (final normalized x coordinate)
 */

class MouseTracker extends EventEmitter {
  private overlayElement: HTMLElement | null = null;
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor() {
    super();
    this.init();
    return this;
  }

  private createInitialTracker(): void {
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'mouse-grid-overlay';

    const overlayStyles = `
      position: fixed;          /* Fixed positioning relative to viewport */
      top: 0;                   /* Cover from top edge */
      left: 0;                  /* Cover from left edge */
      width: 100vw;             /* Full viewport width */
      height: 100dvh;           /* Full viewport height */
      pointer-events: auto;     /* Enable mouse event detection */
      z-index: 99999;           /* Ensure overlay is above other content */
      cursor: default;          /* Show default cursor */
      background: transparent;  /* Completely invisible */
    `;

    this.overlayElement.style.cssText = overlayStyles;
    document.body.appendChild(this.overlayElement);
  }

  private setInitialMousePosition(): void {
    const destroyInitialTracker = (): void => {
      this.overlayElement?.remove();
      this.overlayElement = null;
    };

    this.createInitialTracker();

    new Promise((resolve) => {
      const returnMousePosition = (): void => {
        resolve(this.mousePosition);
        destroyInitialTracker();
        this.emit('init', this.mousePosition);
      };

      const setMousePosition = (event: MouseEvent): void => {
        this.calculateMovement(event.clientX, event.clientY);
        returnMousePosition();
      };

      const listenerOptions = {
        once: true,
        passive: true,
        capture: false,
      };

      this.overlayElement?.addEventListener(
        'mouseenter',
        setMousePosition,
        listenerOptions
      );

      setTimeout(returnMousePosition, 750);
    });
  }

  public getMousePosition(): { x: number; y: number } {
    return this.mousePosition;
  }

  private calculateMovement(x: number, y: number): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // STEP 1: Convert pixels to percentage (0 to 1 range)
    const mouseXPercentage = x / screenWidth;
    const mouseYPercentage = y / screenHeight;

    // STEP 2: Center coordinate system (make center = 0)
    const centeredMouseX = mouseXPercentage - 0.5;
    const centeredMouseY = mouseYPercentage - 0.5;

    // STEP 3: Normalize to full range (-1 to +1)
    const normalizedX = centeredMouseX * 2;
    const normalizedY = centeredMouseY * 2;

    // Limit to 2 decimal places to prevent floating point precision issues
    this.mousePosition.x = parseFloat(normalizedX.toFixed(2));
    this.mousePosition.y = parseFloat(normalizedY.toFixed(2));
  }

  private watchMousePosition(): void {
    const calculateAndEmitMousePosition = (event: MouseEvent) => {
      this.calculateMovement(event.clientX, event.clientY);
      this.emit('mousemove', this.mousePosition);
    };
    window.addEventListener('pointermove', calculateAndEmitMousePosition);
  }

  private init(): void {
    this.setInitialMousePosition();
    this.watchMousePosition();
  }
}

export const mouseTracker = new MouseTracker();
