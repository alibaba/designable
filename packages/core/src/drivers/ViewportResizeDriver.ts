import { EventDriver } from '@designable/shared'
import { Designer } from '../models/Designer'
import { ViewportResizeEvent } from '../events'
import { ResizeObserver } from '@juggle/resize-observer'
export class ViewportResizeDriver extends EventDriver<Designer> {
  request = null

  resizeObserver: ResizeObserver = null

  onResize = (e: any) => {
    if (e.preventDefault) e.preventDefault()
    this.request = requestAnimationFrame(() => {
      cancelAnimationFrame(this.request)
      this.dispatch(
        new ViewportResizeEvent({
          scrollX: this.contentWindow.scrollX,
          scrollY: this.contentWindow.scrollY,
          width: this.contentWindow.innerWidth,
          height: this.contentWindow.innerHeight,
          innerHeight: this.contentWindow.innerHeight,
          innerWidth: this.contentWindow.innerWidth,
          view: this.contentWindow,
          target: e.target || this.container,
        })
      )
    })
  }

  attach() {
    if (this.contentWindow !== window) {
      this.addEventListener('resize', this.onResize)
    } else {
      if (this.container !== document) {
        this.resizeObserver = new ResizeObserver(this.onResize)
        this.resizeObserver.observe(this.container as HTMLElement)
      }
    }
  }

  detach() {
    if (this.contentWindow !== window) {
      this.removeEventListener('resize', this.onResize)
    } else if (this.resizeObserver) {
      if (this.container !== document) {
        this.resizeObserver.unobserve(this.container as HTMLElement)
        this.resizeObserver.disconnect()
      }
    }
  }
}
