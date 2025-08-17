import { gsap } from 'gsap';
import { observer } from './observer';

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
    this.setupMouseHandler();
  }

  private setupObservers(): void {
    this.elements.forEach((element) => {
      // Create quickTo setters for this element
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

      // Set up observer for visibility tracking
      observer(element, this.onElementVisibilityChange.bind(this), {
        threshold: 0.1,
      });
    });
  }

  private onElementVisibilityChange(entry: IntersectionObserverEntry): void {
    const element = entry.target as HTMLElement;

    if (entry.isIntersecting) {
      this.visibleElements.add(element);
    } else {
      this.visibleElements.delete(element);
    }
  }

  private setupMouseHandler(): void {
    window.addEventListener('pointermove', (event) => this.onMouseMove(event));
  }

  private onMouseMove(event: PointerEvent): void {
    if (!this.visibleElements.size) return;

    const { x, y } = this.calculateMousePosition(event);
    this.animateVisibleElements(x, y);
  }

  private calculateMousePosition(event: PointerEvent): {
    x: number;
    y: number;
  } {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    return {
      x: (clientX / innerWidth - 0.5) * 40,
      y: (clientY / innerHeight - 0.5) * 40,
    };
  }

  private animateVisibleElements(x: number, y: number): void {
    this.visibleElements.forEach((element) => {
      const setters = this.elementSetters.get(element);
      setters?.x(x);
      setters?.y(y);
    });
  }
}

export { MouseParallax };
