/**
 * Overlay Animation Effect.
 * See docs: docs/OVERLAY_ANIMATION.md
 */

const element = document.querySelector('[open-overlay]') as HTMLElement;

const lockPageScroll = (isLocked = true) => {
  document.documentElement.classList.toggle('-scroll-lock', isLocked);
};

const settings: gsap.TweenVars = {
  y: '-100%',
  ease: 'power3.in',
  duration: 0.75,
  delay: 0.25,
  onStart: () => lockPageScroll(true),
  onComplete: () => {
    lockPageScroll(false);
    setTimeout(() => (element.hidden = true), 100);
  },
};

(() => {
  if (!element) {
    return console.warn('Overlay element not found');
  }

  gsap.to(element, settings);
})();
