import { GlobalRegistry, IDesignerRegistry } from '@sulesky/core'
import { globalThisPolyfill } from '@sulesky/shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
