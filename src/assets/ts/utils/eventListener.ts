const eventListener = (
  shouldListen: boolean,
  eventName: string,
  callback: Function
) => {
  const states = {
    add: document.addEventListener,
    remove: document.removeEventListener,
  };

  const state = states[shouldListen ? 'add' : 'remove'];
  state(eventName, callback as EventListener);
};

export { eventListener };
