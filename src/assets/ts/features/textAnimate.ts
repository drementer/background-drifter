/**
 * Text Animation Effect.
 * See docs: docs/TEXT_ANIMATE.md
 */

gsap.registerPlugin(SplitText);

const headingElement = document.querySelector('[text-animate]');
const timeLine = gsap.timeline();

const animationSettings: gsap.TweenVars = {
  autoAlpha: 0,
  yPercent: 100,
  duration: 0.55,
  rotation: -15,
  delay: 1,
  ease: 'power4.out',
  stagger: {
    each: 0.01,
  },
};

if (headingElement) {
  const splitText = new SplitText(headingElement, { type: 'chars' });
  const { chars } = splitText;

  timeLine.from(chars, animationSettings);
}
