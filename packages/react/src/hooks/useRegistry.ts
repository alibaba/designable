import { GlobalRegistry, IDesignerRegistry } from '@inbiz/core'
import { globalThisPolyfill } from '@inbiz/shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
