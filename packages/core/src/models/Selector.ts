export type SelectorStore = Map<string, WeakMap<object, Element[] | Element>>

export type ElementResults = { current: Element[] | Element }

const toArray = <T>(target: Iterable<T> | ArrayLike<T>) =>
  Array.from(target || [])

export class Selector {
  private store: SelectorStore = new Map()

  private _queryAll(target: Element | HTMLDocument, selector: string) {
    if (!target) return []
    const results = toArray(target?.querySelectorAll(selector))
    const cacheKey = selector + '@ALL'
    const caches = this.store.get(cacheKey)
    if (caches) {
      caches.set(target, results)
    } else {
      this.store.set(cacheKey, new WeakMap([[target, results]]))
    }
    return results
  }

  private _query(target: Element | HTMLDocument, selector: string) {
    if (!target) return
    const results = target?.querySelector(selector)
    const caches = this.store.get(selector)
    if (caches) {
      caches.set(target, results)
    } else {
      this.store.set(selector, new WeakMap([[target, results]]))
    }
    return results
  }

  private _clean(target: Element | HTMLDocument, key: string) {
    const caches = this.store.get(key)
    if (caches) {
      caches.delete(target)
    }
  }

  queryAll(target: Element | HTMLDocument, selector: string) {
    const cacheKey = selector + '@ALL'
    const caches = this.store.get(cacheKey)
    const results: ElementResults = { current: null }
    if (caches) {
      results.current = caches.get(target)
      if (Array.isArray(results.current)) {
        if (
          results.current.length === 0 ||
          results.current.some((node) => !node.isConnected)
        ) {
          this._clean(target, cacheKey)
          return this._queryAll(target, selector)
        }
        return results.current
      }
      this._clean(target, cacheKey)
      return this._queryAll(target, selector)
    } else {
      return this._queryAll(target, selector)
    }
  }

  query(target: Element | HTMLDocument, selector: string) {
    const caches = this.store.get(selector)
    const results: ElementResults = { current: null }
    if (caches) {
      results.current = caches.get(target)
      if (results.current && !Array.isArray(results.current)) {
        if (!results.current.isConnected) {
          this._clean(target, selector)
          return this._query(target, selector)
        }
        return results.current
      }
      this._clean(target, selector)
      return this._query(target, selector)
    } else {
      return this._query(target, selector)
    }
  }
}
