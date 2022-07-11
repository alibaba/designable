export const throttle = <T extends (...args: any[]) => void>(
  callback: T,
  duration = 16
): T => {
  let lastTime = 0
  let cacheValue = null
  return function () {
    const now = performance.now()
    if (now - lastTime > duration) {
      cacheValue = callback.apply(this, arguments)
      lastTime = now
    }
    return cacheValue
  } as any
}
