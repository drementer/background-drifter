import { gsap } from 'gsap';
import { intersectionObserver } from '../utils/intersectionObserver';
import { mouseTracker } from '../utils/mouseTracker';

/**
 * 🖱️ SIMPLE MOUSE PARALLAX
 *
 * PURPOSE:
 * Lightweight mouse parallax effect with viewport optimization
 * Elements follow mouse movement only when visible in viewport
 */

class MouseParallax {
  private elements: NodeListOf<HTMLElement>;
  private visibleElements: Set<HTMLElement> = new Set();
  private elementSetters: Map<HTMLElement, { x: Function; y: Function }> =
    new Map();

  constructor(selector: string = '[mouse-parallax]') {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  private init(): void {
    if (this.elements.length === 0) return;

    this.setupObservers();
    mouseTracker.on('init', this.animateVisibleElements.bind(this));
    mouseTracker.on('mousemove', this.animateVisibleElements.bind(this));
  }

  private setupObservers(): void {
    const createElementSetters = (element: HTMLElement) => {
      const xSetter = gsap.quickTo(element, 'x', {
        duration: 0.6,
        ease: 'power2.out',
      });
      const ySetter = gsap.quickTo(element, 'y', {
        duration: 0.6,
        ease: 'power2.out',
      });

      // Store setters for this element
      this.elementSetters.set(element, { x: xSetter, y: ySetter });
    };

    const onIntersection = (entry: IntersectionObserverEntry) => {
      const element = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        this.visibleElements.add(element);
      } else {
        this.visibleElements.delete(element);
      }
    };

    const setUpElement = (element: HTMLElement) => {
      createElementSetters(element);
      intersectionObserver(element, onIntersection, { threshold: 0.1 });
    };

    this.elements.forEach(setUpElement);
  }

  private animateVisibleElements(position: { x: number; y: number }): void {
    const { x, y } = position;
    const xMovement = x * 20;
    const yMovement = y * 20;

    const animateElements = (element: HTMLElement) => {
      const setters = this.elementSetters.get(element);

      setters?.x(xMovement);
      setters?.y(yMovement);
    };

    this.visibleElements.forEach(animateElements);
  }
}

const createMouseParallax = () => {
  const havePointer = window.matchMedia('(pointer:fine)').matches;
  if (havePointer) new MouseParallax();
};

export { createMouseParallax };
