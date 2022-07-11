const getDescriptor = Object.getOwnPropertyDescriptor

const getProto = Object.getPrototypeOf

const ClassDescriptorMap = new WeakMap()

function getPropertyDescriptor(obj: any, key: PropertyKey): PropertyDescriptor {
  function _getPropertyDescriptor(obj: any, key: PropertyKey) {
    if (!obj) return
    return getDescriptor(obj, key) || _getPropertyDescriptor(getProto(obj), key)
  }
  const constructor = obj.constructor
  if (constructor === Object || constructor === Array)
    return _getPropertyDescriptor(obj, key)
  const cache = ClassDescriptorMap.get(constructor) || {}
  const descriptor = cache[key]
  if (descriptor) return descriptor
  const newDesc = _getPropertyDescriptor(obj, key)
  ClassDescriptorMap.set(constructor, cache)
  cache[key] = newDesc
  return newDesc
}

export interface IComputeScheduler {
  start: () => void
  end: () => void
  run: <T>(callback: () => T) => T
  bound: <T extends (...args: any[]) => any>(callback: T) => T
}

export const computable = <T>(target: T, keys: (keyof T)[] = []) => {
  const CacheState = {
    caching: false,
    value: new Map<any, any>(),
  }
  keys.forEach((key) => {
    const descriptor = getPropertyDescriptor(target, key)
    if (descriptor?.get) {
      Object.defineProperty(target, key, {
        ...descriptor,
        get() {
          if (CacheState.caching) {
            if (CacheState.value.has(key)) {
              return CacheState.value.get(key)
            }
          }
          const result = descriptor.get.call(target)
          CacheState.value.set(key, result)
          return result
        },
      })
    }
  })
  const start = () => {
    CacheState.caching = true
  }
  const end = () => {
    CacheState.caching = false
    CacheState.value.clear()
  }
  const run = <T>(callback: () => T): T => {
    start()
    const result = callback?.()
    end()
    return result
  }
  const bound = <T extends (...args: any[]) => any>(callback: T): T => {
    return ((...args: any[]) => run(() => callback(...args))) as any
  }
  return {
    start,
    end,
    run,
    bound,
  }
}
