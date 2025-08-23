import { gsap } from 'gsap';

const parallaxElements = document.querySelectorAll(
  '[parallax-element-wrapper]'
);

const settings = {
  duration: 0.75,
  scale: 0.5,
  opacity: 0,
  ease: 'back.out',
  delay: 1,
  stagger: {
    from: 'random',
    amount: 1,
  },
} as gsap.TweenVars;

const animateParallaxElements = () => {
  if (!parallaxElements) return console.warn('No parallax elements found');
  gsap.from(parallaxElements, settings);
};

export { animateParallaxElements };
