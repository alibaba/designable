import { IEngineContext } from '../../types'
import { globalThisPolyfill } from '@designable/shared'

export interface ICursorEventOriginData {
  clientX: number
  clientY: number
  pageX: number
  pageY: number
  target: EventTarget
  view: Window
}

export interface ICursorEventData extends ICursorEventOriginData {
  topClientX?: number
  topClientY?: number
  topPageX?: number
  topPageY?: number
}

export class AbstractCursorEvent {
  data: ICursorEventData

  context!: IEngineContext

  constructor(data: ICursorEventOriginData) {
    this.data = data || {
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      target: undefined,
      view: globalThisPolyfill,
    }
    this.transformCoordinates()
  }

  transformCoordinates() {
    const { frameElement } = this.data?.view || {}
    if (frameElement && this.data.view !== globalThisPolyfill) {
      const frameRect = frameElement.getBoundingClientRect()
      const scale = frameRect.width / (frameElement as any)['offsetWidth']
      this.data.topClientX = this.data.clientX * scale + frameRect.x
      this.data.topClientY = this.data.clientY * scale + frameRect.y
      this.data.topPageX =
        this.data.pageX + frameRect.x - this.data.view.scrollX
      this.data.topPageY =
        this.data.pageY + frameRect.y - this.data.view.scrollY
      // Ensure coordinates are finite before calling elementFromPoint
      if (
        Number.isFinite(this.data.topPageX) &&
        Number.isFinite(this.data.topClientY)
      ) {
        const topElement = document.elementFromPoint(
          this.data.topPageX,
          this.data.topClientY
        )
        if (topElement && topElement !== frameElement) {
          this.data.target = topElement
        }
      }
    } else {
      this.data.topClientX = this.data.clientX
      this.data.topClientY = this.data.clientY
      this.data.topPageX = this.data.pageX
      this.data.topPageY = this.data.pageY
    }
  }
}
