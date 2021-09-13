import { EventDriver } from '@designable/shared'
import { Engine } from '../models/Engine'
import { MouseClickEvent, MouseDoubleClickEvent } from '../events'

export class MouseClickDriver extends EventDriver<Engine> {
  onMouseClick = (e: MouseEvent) => {
    e.stopPropagation() //master一定会注册一次，阻止冒泡是防止触发多次
    const target = e.target as HTMLElement
    if (
      target?.closest(`*[${this.engine.props.clickStopPropagationAttrName}]`)
    ) {
      return
    }
    this.dispatch(
      new MouseClickEvent({
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        target: e.target,
        view: e.view,
      })
    )
  }

  onMouseDoubleClick = (e: MouseEvent) => {
    e.stopPropagation() //master一定会注册一次，阻止冒泡是防止触发多次
    const target = e.target as HTMLElement
    if (
      target?.closest(`*[${this.engine.props.clickStopPropagationAttrName}]`)
    ) {
      return
    }
    this.dispatch(
      new MouseDoubleClickEvent({
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        target: e.target,
        view: e.view,
      })
    )
  }

  attach() {
    this.addEventListener('click', this.onMouseClick, {
      once: true, //防止对同一个container注册多次click
    })
    this.addEventListener('dblclick', this.onMouseDoubleClick, {
      once: true, //防止对同一个container注册多次click
    })
  }

  detach() {
    this.removeEventListener('click', this.onMouseClick, {
      once: true,
    })
    this.removeEventListener('dblclick', this.onMouseDoubleClick, {
      once: true,
    })
  }
}
