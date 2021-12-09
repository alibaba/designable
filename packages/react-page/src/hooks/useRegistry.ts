import { GlobalRegistry, IDesignerRegistry } from '@designable/core'

export const useRegistry = (): IDesignerRegistry => {
  return window['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
