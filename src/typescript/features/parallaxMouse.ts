import { intersectionObserver } from '../utils/intersectionObserver';
import { mouseTracker } from '../utils/mouseTracker';
import { havePointer } from '../utils/havePointer';

/**
 * Mouse Parallax Effect.
 * See docs: docs/PARALLAX_MOUSE.md
 */

class MouseParallax {
  private elements: NodeListOf<HTMLElement>;
  private visibleElements: Set<HTMLElement> = new Set();
  private elementSetters: Map<
    HTMLElement,
    { x: gsap.QuickToFunc; y: gsap.QuickToFunc }
  > = new Map();

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
      const settings: gsap.TweenVars = {
        duration: 2.5,
        ease: 'expo.out',
      };

      const xSetter = gsap.quickTo(element, 'x', settings);
      const ySetter = gsap.quickTo(element, 'y', settings);

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
      intersectionObserver(element, onIntersection);
    };

    this.elements.forEach(setUpElement);
  }

  private animateVisibleElements({ x, y }: { x: number; y: number }): void {
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

if (havePointer) new MouseParallax();
