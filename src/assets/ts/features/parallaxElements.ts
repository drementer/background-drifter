import { gsap } from 'gsap';

const parallaxElements = document.querySelectorAll(
  '[parallax-element-wrapper]'
);

const settings = {
  duration: 0.75,
  scale: 0.5,
  opacity: 0,
  ease: 'back.out',
  delay: 0.75,
  stagger: {
    from: 'random',
    amount: 1,
  },
};

const animateParallaxElements = () => {
  if (!parallaxElements) return console.warn('No parallax elements found');
  gsap.from(parallaxElements, settings as gsap.TweenVars);
};

export { animateParallaxElements };
