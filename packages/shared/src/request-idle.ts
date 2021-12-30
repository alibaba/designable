import 'requestidlecallback'
import { window } from './window'

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
  return window['requestIdleCallback'](callback, options)
}

export const cancelIdle = (id: number) => {
  window['cancelIdleCallback'](id)
}
