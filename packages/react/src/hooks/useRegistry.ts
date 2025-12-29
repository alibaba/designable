import { GlobalRegistry, IDesignerRegistry } from '@designable/core'
import { globalThisPolyfill } from '@designable/shared'

export const useRegistry = (): IDesignerRegistry => {
  return (globalThisPolyfill as any)['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
