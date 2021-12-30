import { IEngineContext } from '../../types'
import { window } from '@designable/shared'

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
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      view: window,
      target: window,
    }
  }
}
