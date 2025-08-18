import { EventEmitter } from './eventEmitter';

/**
 * 🖱️ MOUSE TRACKER - Initial Position Detection
 *
 * PURPOSE:
 * This module provides a way to get the initial mouse position when the page loads.
 * It's designed to be lightweight and only capture the position once, then clean up.
 *
 * WHY WE NEED THIS:
 * - On page load, we don't know where the mouse cursor is positioned
 * - We need this information for initial parallax effects or UI positioning
 * - Traditional mouse tracking is continuous and resource-intensive
 * - This gives us a one-time snapshot efficiently
 *
 * HOW IT WORKS:
 * 1. Creates a transparent overlay covering the entire viewport
 * 2. Listens for the first mouse/pointer event (mouseenter, mousemove, etc.)
 * 3. Captures the coordinates and immediately resolves the Promise
 * 4. Automatically cleans up the overlay and event listeners
 *
 * THE MATH BEHIND IT:
 * We need to convert mouse pixels into background movement distance.
 * This happens in 4 clear steps:
 *
 * Step 1: CENTERING (Make middle = zero)
 * Step 2: NORMALIZING (Scale to -1 and +1 range)
 * Step 3: SCALING (Apply real movement distance in px units)
 *
 * EXAMPLE: Mouse at right edge of 1920px screen
 * Step 1: 1920/1920 = 1.0 → 1.0 - 0.5 = 0.5 (centered)
 * Step 2: 0.5 × 2 = 1.0 (normalized to full range)
 * Step 3: 1.0 × 75(maxMovement) = 75px (final movement distance)
 */

/**
 * MouseTracker class handles the creation and cleanup of the overlay element
 * that captures the initial mouse position.
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

    const mouseXPercentage = x / screenWidth;
    const mouseYPercentage = y / screenHeight;

    const centeredMouseX = mouseXPercentage - 0.5;
    const centeredMouseY = mouseYPercentage - 0.5;

    const normalizedX = centeredMouseX * 2;
    const normalizedY = centeredMouseY * 2;

    this.mousePosition.x = normalizedX;
    this.mousePosition.y = normalizedY;
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
