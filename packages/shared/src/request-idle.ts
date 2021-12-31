import 'requestidlecallback'
import { globalThisPolyfill } from './globalThisPolyfill'

export interface IIdleDeadline {
  didTimeout: boolean
  timeRemaining: () => DOMHighResTimeStamp
}

export interface IdleCallbackOptions {
  timeout?: number
}

export const requestIdle = (
  callback: (params: IIdleDeadline) => void,
  options?: IdleCallbackOptions
): number => {
  return globalThisPolyfill['requestIdleCallback'](callback, options)
}

export const cancelIdle = (id: number) => {
  globalThisPolyfill['cancelIdleCallback'](id)
}
