{
  /**
   * ===============================================
   * 🎨 PARALLAX MOUSE TRACKING EFFECT
   * ===============================================
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
   *
   * EXAMPLE: Mouse at right edge of 1920px screen
   * Step 1: 1920/1920 = 1.0 → 1.0 - 0.5 = 0.5 (centered)
   * Step 2: 0.5 × 2 = 1.0 (normalized to full range)
   * Step 3: 1.0 × 75 = 75vw (final movement distance)
   * Result: Background moves 75vw to the LEFT (opposite direction)
   */
  const backgroundImageElement = document.querySelector("[background-stuff]");
  if (!backgroundImageElement) {
    throw new Error(
      "Background element with attribute '[background-stuff]' not found!"
    );
  }
  // Current position of the background (where it actually is)
  let currentBackgroundX = 0;
  let currentBackgroundY = 0;
  // Target position (where we want the background to be)
  let targetBackgroundX = 0;
  let targetBackgroundY = 0;
  // Animation frame ID for smooth movement
  let animationFrameId;
  // Configuration object for easy customization
  const parallaxConfig = {
    // Maximum movement distance in viewport units (vw/vh)
    // 75 vw/vh = 75% of screen width/height
    maxMovementX: 75,
    maxMovementY: 75,
    // Animation smoothness (0.01 = very slow, 1 = instant)
    smoothnessFactor: 0.12,
    // Stop animation when distance is smaller than this
    stopThreshold: 0.1,
  };
  /**
   * Calculates the background movement based on mouse position
   * @param mouseXPosition - X coordinate of mouse in pixels
   * @param mouseYPosition - Y coordinate of mouse in pixels
   */
  const calculateMovement = (mouseXPosition, mouseYPosition) => {
    // Get screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    // Convert mouse position to percentage (0.0 to 1.0)
    // 0 = left/top edge, 1 = right/bottom edge
    const mouseXPercentage = mouseXPosition / screenWidth;
    const mouseYPercentage = mouseYPosition / screenHeight;
    /**
     * STEP 1: CENTER THE MOUSE POSITION
     *
     * What we have: mouseXPercentage tells us how far the mouse is from the LEFT edge
     * - 0 = at the left edge (0% from left)
     * - 0.5 = in the center (50% from left)
     * - 1 = at the right edge (100% from left)
     *
     * What we want: Make the CENTER of screen = 0, so we can measure distance FROM center
     * - Left side should be negative (-)
     * - Center should be zero (0)
     * - Right side should be positive (+)
     *
     * Solution: Subtract 0.5 to shift the center point to zero
     *
     * Examples:
     * - Left edge: 0.0 - 0.5 = -0.5 (half distance left of center)
     * - Quarter point: 0.25 - 0.5 = -0.25 (quarter distance left of center)
     * - Center: 0.5 - 0.5 = 0 (exactly at center, no movement needed)
     * - Three-quarter: 0.75 - 0.5 = +0.25 (quarter distance right of center)
     * - Right edge: 1.0 - 0.5 = +0.5 (half distance right of center)
     *
     * Result: Now ranges from -0.5 to +0.5, with center = 0
     */
    const centeredMouseX = mouseXPercentage - 0.5;
    const centeredMouseY = mouseYPercentage - 0.5;
    /**
     * STEP 2: EXPAND TO FULL MOVEMENT RANGE
     *
     * What we have: Distance from center is only -0.5 to +0.5 (half range)
     * - From center to edge = maximum 0.5 distance
     * - This gives us only HALF of the movement capability we want
     *
     * What we want: Full movement range from -1 to +1 (full diameter)
     * - We want the FULL movement capacity, not just half
     * - Think of it as expanding the "movement diameter" to use the entire range
     *
     * Solution: Multiply by 2 to convert half-range to full-range
     * - This converts our "radius" (0.5) into "diameter" (1.0)
     * - Now we can use the complete movement potential
     *
     * Examples:
     * - Left edge (-0.5): -0.5 × 2 = -1.0 (maximum leftward movement)
     * - Quarter left (-0.25): -0.25 × 2 = -0.5 (half leftward movement)
     * - Center (0): 0 × 2 = 0 (no movement)
     * - Quarter right (+0.25): +0.25 × 2 = +0.5 (half rightward movement)
     * - Right edge (+0.5): +0.5 × 2 = +1.0 (maximum rightward movement)
     *
     * Result: Full movement diameter from -1 to +1
     */
    const normalizedX = centeredMouseX * 2;
    const normalizedY = centeredMouseY * 2;
    /**
     * STEP 3: APPLY REAL MOVEMENT DISTANCE
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
    const horizontalMovement = normalizedX * parallaxConfig.maxMovementX; // Final: -75vw to +75vw
    const verticalMovement = normalizedY * parallaxConfig.maxMovementY; // Final: -75vh to +75vh
    // Set new target positions (negative for opposite direction effect)
    targetBackgroundX = -horizontalMovement;
    targetBackgroundY = -verticalMovement;
  };
  /**
   * Updates the background position using CSS transform
   * @param xPosition - Horizontal position in viewport width units (vw)
   * @param yPosition - Vertical position in viewport height units (vh)
   */
  const moveBackgroundTo = (xPosition, yPosition) => {
    backgroundImageElement.style.transform = `translate(${xPosition}vw, ${yPosition}vh)`;
  };
  /**
   * Smooth animation function that gradually moves background to target position
   * Uses linear interpolation (lerp) for smooth movement
   */
  const animateBackgroundMovement = () => {
    // First, clear any existing animation to prevent conflicts
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    // Calculate how far we need to move (distance to target)
    const distanceToTargetX = targetBackgroundX - currentBackgroundX;
    const distanceToTargetY = targetBackgroundY - currentBackgroundY;
    // Apply smoothness - move only a fraction of the distance each frame
    const smoothMovementX = distanceToTargetX * parallaxConfig.smoothnessFactor;
    const smoothMovementY = distanceToTargetY * parallaxConfig.smoothnessFactor;
    // Update current position by adding the smooth movement
    currentBackgroundX += smoothMovementX;
    currentBackgroundY += smoothMovementY;
    // Actually move the background to the new position
    moveBackgroundTo(currentBackgroundX, currentBackgroundY);
    // Continue animating if we haven't reached the target yet
    const distanceX = Math.abs(targetBackgroundX - currentBackgroundX);
    const distanceY = Math.abs(targetBackgroundY - currentBackgroundY);
    const stillMovingX = distanceX > parallaxConfig.stopThreshold;
    const stillMovingY = distanceY > parallaxConfig.stopThreshold;
    if (stillMovingX || stillMovingY) {
      animationFrameId = requestAnimationFrame(animateBackgroundMovement);
    }
  };
  /**
   * Handles mouse movement events and triggers background animation
   * @param mouseEvent - The mouse move event from the browser
   */
  const onMouseMove = (mouseEvent) => {
    // Get current mouse position on screen
    const mouseXPosition = mouseEvent.clientX;
    const mouseYPosition = mouseEvent.clientY;
    calculateMovement(mouseXPosition, mouseYPosition);
    animateBackgroundMovement();
  };
  document.addEventListener("mousemove", onMouseMove);
}
export {};
