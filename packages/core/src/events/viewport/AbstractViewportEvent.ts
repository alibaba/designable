import { IEngineContext } from '../../types'
import { globalThisPolyfill } from '@designable/shared'

export interface IViewportEventData {
  scrollX: number
  scrollY: number
  width: number
  height: number
  view: Window
  innerWidth: number
  innerHeight: number
  target: EventTarget
}

export class AbstractViewportEvent {
  data: IViewportEventData
  context: IEngineContext
  constructor(data: IViewportEventData) {
    this.data = data || {
      scrollX: globalThisPolyfill.scrollX,
      scrollY: globalThisPolyfill.scrollY,
      width: globalThisPolyfill.innerWidth,
      height: globalThisPolyfill.innerHeight,
      innerWidth: globalThisPolyfill.innerWidth,
      innerHeight: globalThisPolyfill.innerHeight,
      view: globalThisPolyfill,
      target: globalThisPolyfill,
    }
  }
}
