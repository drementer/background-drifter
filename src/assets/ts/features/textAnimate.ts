import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const headingElement = document.querySelector('[text-animate]') as HTMLElement;
const timeLine = gsap.timeline();

const animationSettings = {
  autoAlpha: 0,
  yPercent: 100,
  duration: 0.55,
  rotation: -15,
  delay: 1,
  ease: 'power4.out',
  stagger: {
    each: 0.01,
  },
} as gsap.TweenVars;

const createTextAnimation = () => {
  if (!headingElement) return console.warn('No heading element found');

  const splitText = new SplitText(headingElement, { type: 'chars' });
  const { chars } = splitText;

  timeLine.from(chars, animationSettings);
};

export { createTextAnimation };
