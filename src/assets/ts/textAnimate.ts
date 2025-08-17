import { gsap } from 'gsap';

const headingElement = document.querySelector('[text-animate]') as HTMLElement;
const timeLine = gsap.timeline();

const animationSettings = {
  autoAlpha: 0,
  yPercent: 100,
  duration: 0.75,
  rotation: -30,
  delay: 0.5,
  ease: 'power4.out',
  stagger: {
    each: 0.025,
  },
};

const createTextAnimation = () => {
  const chars = headingElement.textContent?.split('') || [];
  const textWrapper = document.createElement('span');

  const createSpan = (char: string) => {
    return Object.assign(document.createElement('span'), {
      textContent: char,
    });
  };

  const elements = chars.map(createSpan);

  textWrapper.classList.add('text-animate-wrapper');
  textWrapper.append(...elements);

  headingElement.textContent = '';
  headingElement.append(textWrapper);

  timeLine.from(elements, animationSettings);
};

export { createTextAnimation };
