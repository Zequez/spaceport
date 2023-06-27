export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function debounced(...args: Parameters<T>): void {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime = 0;

  return function throttled(...args: Parameters<T>): void {
    const currentTime = Date.now();

    if (!lastCallTime || currentTime - lastCallTime >= delay) {
      fn.apply(null, args);
      lastCallTime = currentTime;
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(null, args);
        lastCallTime = Date.now();
      }, delay - (currentTime - lastCallTime));
    }
  };
}
