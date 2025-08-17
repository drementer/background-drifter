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
 * USAGE:
 * const position = await getInitialMousePosition();
 * console.log('Mouse at:', position.x, position.y);
 */

/**
 * MouseTracker class handles the creation and cleanup of the overlay element
 * that captures the initial mouse position.
 */
class MouseTracker {
  private overlayElement: HTMLElement | null = null;
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  /**
   * Creates a transparent overlay that covers the entire viewport.
   * This overlay is invisible to the user but can detect mouse events.
   *
   * WHY FULL VIEWPORT COVERAGE:
   * - Ensures we catch mouse events regardless of where the cursor is
   * - Prevents missing events if mouse is at screen edges
   * - Provides consistent behavior across different screen sizes
   */
  private createOverlay(): void {
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'mouse-grid-overlay';

    /**
     * CSS styles for the overlay
     * Note: pointer-events: auto allows the overlay to receive mouse events
     * while remaining completely transparent
     *
     */
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

  /**
   * Main method that creates the overlay and returns a Promise
   * that resolves with the initial mouse position.
   *
   * HOW THE PROMISE WORKS:
   * 1. Creates the overlay immediately
   * 2. Sets up event listener for mouse events
   * 3. Promise resolves when first mouse event occurs
   * 4. Automatically cleans up after resolution
   *
   * @returns Promise that resolves with {x, y} coordinates
   */
  public getMousePosition(): Promise<{ x: number; y: number }> {
    this.createOverlay();

    return new Promise((resolve) => {
      /**
       * Event handler that captures mouse position and resolves the Promise.
       * This function is called when the first mouse event occurs.
       *
       * WHY mouseenter EVENT:
       * - mouseenter fires when mouse enters the overlay area
       * - More reliable than mousemove for initial detection
       * - Fires only once per entry (perfect for one-time capture)
       */
      const setMousePosition = (event: MouseEvent): void => {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;

        resolve(this.mousePosition);
        this.destroy();
      };

      // - once: true     → Automatically remove after first trigger
      // - passive: true  → Performance optimization (we don't call preventDefault)
      // - capture: false → Listen in bubbling phase (default behavior)
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
    });
  }

  private destroy(): void {
    this.overlayElement?.remove();
    this.overlayElement = null;
  }
}

/**
 * Public API function that creates a MouseTracker instance and returns
 * a Promise for the initial mouse position.
 *
 * DESIGN PATTERN:
 * - Factory function that encapsulates the class instantiation
 * - Returns a clean Promise interface
 * - Handles the lifecycle automatically
 *
 * @returns Promise that resolves with initial mouse position {x, y}
 */
export const getInitialMousePosition = async () => {
  return new MouseTracker().getMousePosition();
};
