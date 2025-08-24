import { EventEmitter } from './eventEmitter';
import { havePointer } from './havePointer';

/**
 * Mouse Tracker.
 * See docs: docs/MOUSE_TRACKER.md
 */

class MouseTracker extends EventEmitter {
  private overlayElement: HTMLElement | null = null;
  public mousePosition: { x: number; y: number } = { x: 0, y: 0 };

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

      setTimeout(returnMousePosition, 1_000);
    });
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
    const calculateAndEmitMousePosition = (event: PointerEvent) => {
      this.calculateMovement(event.clientX, event.clientY);
      this.emit('mousemove', this.mousePosition);
    };
    window.addEventListener('pointermove', calculateAndEmitMousePosition);
  }

  private init(): void {
    if (!havePointer) {
      this.emit('init', this.mousePosition);
      return;
    }

    this.setInitialMousePosition();
    this.watchMousePosition();
  }
}

export const mouseTracker = new MouseTracker();
