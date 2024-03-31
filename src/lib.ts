export function debounce<F extends (...args: any[]) => void>(
  func: F,
  timeout = 2000
): (...args: Parameters<F>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<F>): void => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(null, args)
    }, timeout)
  }
}
