import { GlobalRegistry, IDesignerRegistry } from '@sulesky/next-core'
import { globalThisPolyfill } from '@sulesky/next-shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
