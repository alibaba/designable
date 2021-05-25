import { registry } from '@designable/core'

export const useRegistry = (): typeof registry => {
  return window['__DESIGNER_REGISTRY__'] || registry
}
