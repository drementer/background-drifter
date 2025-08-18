class EventEmitter {
  #events = new Map();

  private validateParams(eventName: string, callback: Function) {
    if (typeof eventName !== 'string') {
      return console.warn('Event name must be a string');
    }
    if (typeof callback !== 'function') {
      return console.warn('Callback must be a function');
    }
  }

  on(eventName: string, callback: Function) {
    this.validateParams(eventName, callback);

    if (!this.#events.has(eventName)) {
      this.#events.set(eventName, []);
    }
    this.#events.get(eventName).push(callback);
    return this;
  }

  off(eventName: string, callback: Function) {
    this.validateParams(eventName, callback);

    if (!this.#events.has(eventName)) return this;

    const listeners = this.#events.get(eventName);
    this.#events.set(
      eventName,
      listeners.filter((listener: Function) => listener !== callback)
    );
    return this;
  }

  once(eventName: string, callback: Function) {
    const oneTimeListener = (...args: any[]) => {
      callback(...args);
      this.off(eventName, oneTimeListener);
    };

    return this.on(eventName, oneTimeListener);
  }

  emit(eventName: string, ...args: any[]) {
    if (typeof eventName !== 'string') {
      return console.warn('Event name must be a string');
    }

    const handlers = this.#events.get(eventName);
    if (!handlers?.length) return false;

    handlers.forEach((callback: Function) => callback(...args));
    return true;
  }

  get events() {
    return Object.fromEntries(this.#events);
  }
}

export { EventEmitter };
