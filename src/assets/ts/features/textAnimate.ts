import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Register the SplitText plugin
gsap.registerPlugin(SplitText);

const headingElement = document.querySelector('[text-animate]') as HTMLElement;
const timeLine = gsap.timeline();

const animationSettings = {
  autoAlpha: 0,
  yPercent: 100,
  duration: 0.55,
  rotation: -15,
  delay: 0.75,
  ease: 'power4.out',
  stagger: {
    each: 0.01,
  },
};

const createTextAnimation = () => {
  const splitText = new SplitText(headingElement, { type: 'chars' });
  const { chars } = splitText;
  timeLine.from(chars, animationSettings);
};

export { createTextAnimation };
