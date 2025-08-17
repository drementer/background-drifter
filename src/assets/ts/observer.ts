const observer = (
  item: HTMLElement,
  callback: Function,
  settings: IntersectionObserverInit
) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => callback(entry, observer));
  }, settings);

  observer.observe(item);
};

export { observer };
