import { gsap } from 'gsap';

const element = document.querySelector('[open-overlay]') as HTMLDivElement;

const lockPageScroll = (isLocked = true) => {
  document.documentElement.classList.toggle('-scroll-lock', isLocked);
};

const hideSettings = {
  y: '-100%',
  ease: 'power3.in',
  duration: 0.75,
  delay: 0.25,
  onStart: () => lockPageScroll(true),
  onComplete: () => {
    lockPageScroll(false);
    setTimeout(() => (element!.hidden = true), 100);
  },
} as gsap.TweenVars;

const hideOverlay = () => {
  gsap.to(element, hideSettings);
};

export { hideOverlay };
