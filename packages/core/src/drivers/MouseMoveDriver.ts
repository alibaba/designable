import { EventDriver } from '@designable/shared'
import { Engine } from '../models/Engine'
import { MouseMoveEvent } from '../events'
export class MouseMoveDriver extends EventDriver<Engine> {
  request = null

  onMouseMove = (e: MouseEvent) => {
    e.stopPropagation()
    this.request = requestAnimationFrame(() => {
      cancelAnimationFrame(this.request)
      this.dispatch(
        new MouseMoveEvent({
          clientX: e.clientX,
          clientY: e.clientY,
          pageX: e.pageX,
          pageY: e.pageY,
          target: e.target,
          view: e.view,
        })
      )
    })
  }

  attach() {
    this.addEventListener('mousemove', this.onMouseMove, {
      once: true,
    })
  }

  detach() {
    this.removeEventListener('mouseover', this.onMouseMove, {
      once: true,
    })
  }
}
