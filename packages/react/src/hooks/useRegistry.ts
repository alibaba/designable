import { GlobalRegistry, IDesignerRegistry } from '@designable/core'
import { window } from '@designable/shared'

export const useRegistry = (): IDesignerRegistry => {
  return window['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
