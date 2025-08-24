/**
 * Parallax Elements Animation.
 * See docs: /docs/PARALLAX_ELEMENTS.md
 */

const parallaxElements = document.querySelectorAll(
  '[parallax-element-wrapper]'
);

const settings: gsap.TweenVars = {
  duration: 0.75,
  scale: 0.5,
  opacity: 0,
  ease: 'back.out',
  delay: 1,
  stagger: {
    from: 'random',
    amount: 1,
  },
};

if (parallaxElements) gsap.from(parallaxElements, settings);
