export type SelectorStore = Map<
  string, //id
  WeakMap<HTMLElement, HTMLElement[]>
>

export class NodeSelector {
  private store: SelectorStore = new Map()

  private _queryAll(target: HTMLElement, attrName: string, id: string) {
    if (!target) return []
    target
      .querySelectorAll(`*[${attrName}]`)
      .forEach((element: HTMLElement) => {
        const _id = element.getAttribute(attrName)
        const map = this.store.get(_id)
        if (map) {
          const elements = map.get(target)
          if (!elements) {
            map.set(target, [element])
          } else {
            map.set(target, elements.concat(element))
          }
        } else {
          this.store.set(_id, new WeakMap([[target, [element]]]))
        }
      })
    return this.store.get(id)?.get(target) ?? []
  }

  private _clean(target: HTMLElement, id: string) {
    const caches = this.store.get(id)
    if (caches) {
      caches.delete(target)
    }
  }

  queryAll(target: HTMLElement, attrName: string, id: string): HTMLElement[] {
    const caches = this.store.get(id)
    if (caches) {
      const elements = caches.get(target)
      if (!elements || elements.some((el) => !el.isConnected))
        return this._queryAll(target, attrName, id)
      return elements
    } else {
      return this._queryAll(target, attrName, id)
    }
  }

  query(target: HTMLElement, attrName: string, id: string) {
    return this.queryAll(target, attrName, id)?.[0]
  }
}
