const intersectionObserver = (
  item: Element,
  callback: (
    entry: IntersectionObserverEntry,
    observer: IntersectionObserver
  ) => void,
  settings: IntersectionObserverInit = {
    threshold: 0,
    rootMargin: '100px',
  }
) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => callback(entry, observer));
  }, settings);

  observer.observe(item);
};

export { intersectionObserver };
