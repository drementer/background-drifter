type EventCallback = (...args: any[]) => void;
type EventMap = Map<string, EventCallback[]>;

class EventEmitter {
  private readonly events: EventMap = new Map();

  on(eventName: string, callback: EventCallback): this {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const listeners = this.events.get(eventName)!;
    listeners.push(callback);
    return this;
  }

  off(eventName: string, callback: EventCallback): this {
    if (!this.events.has(eventName)) return this;

    const listeners = this.events.get(eventName)!;
    const filteredListeners = listeners.filter((listener) => {
      return listener !== callback;
    });
    this.events.set(eventName, filteredListeners);

    return this;
  }

  toggle(eventName: string, callback: EventCallback): this {
    const listeners = this.events.get(eventName) || [];
    const hasThisCallback = listeners.includes(callback);

    if (hasThisCallback) {
      this.off(eventName, callback);
    } else {
      this.on(eventName, callback);
    }

    return this;
  }

  once(eventName: string, callback: EventCallback): this {
    const oneTimeListener: EventCallback = (...args: any[]) => {
      callback(...args);
      this.off(eventName, oneTimeListener);
    };

    return this.on(eventName, oneTimeListener);
  }

  emit(eventName: string, ...args: any[]): boolean {
    const handlers = this.events.get(eventName);

    if (!handlers?.length) return false;

    handlers.forEach((callback) => callback(...args));
    return true;
  }

  get eventList() {
    return Object.fromEntries(this.events);
  }
}

export { EventEmitter };
