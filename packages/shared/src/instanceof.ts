import { isStr, isFn } from './types'
import { globalThisPolyfill } from './globalThisPolyfill'
export const instOf = (value: any, cls: any) => {
  if (isFn(cls)) return value instanceof cls
  if (isStr(cls))
    return (globalThisPolyfill as any)[cls]
      ? value instanceof (globalThisPolyfill as any)[cls]
      : false
  return false
}
