import { Engine, CursorType, CursorDragType } from '../models'
import { DragStartEvent, DragMoveEvent, DragStopEvent } from '../events'
import { TreeNode } from '../models'
import { Point } from '@designable/shared'

type ResizeData = {
  element?: Element
  node?: TreeNode
  axis?: 'x' | 'y' | (string & {})
  type?: 'x-start' | 'x-end' | 'y-start' | 'y-end' | (string & {})
  point?: Point
}

type ResizeStore = {
  value?: ResizeData
}

export const useResizeEffect = (engine: Engine) => {
  const findStartNodeHandler = (target: HTMLElement): ResizeData => {
    const handler = target?.closest(
      `*[${engine.props.nodeResizeHandlerAttrName}]`
    )
    if (handler) {
      const type = handler.getAttribute(engine.props.nodeResizeHandlerAttrName)
      if (type) {
        const element = handler.closest(
          `*[${engine.props.nodeSelectionIdAttrName}]`
        )
        if (element) {
          const nodeId = element.getAttribute(
            engine.props.nodeSelectionIdAttrName
          )
          if (nodeId) {
            const node = engine.findNodeById(nodeId)
            if (node) {
              const axis = type.includes('x') ? 'x' : 'y'
              return { axis, type, node, element }
            }
          }
        }
      }
    }
    return
  }

  const store: ResizeStore = {}

  engine.subscribeTo(DragStartEvent, (event) => {
    if (engine.cursor.type !== CursorType.Normal) return
    const target = event.data.target as HTMLElement
    const data = findStartNodeHandler(target)
    if (data) {
      const point = new Point(event.data.clientX, event.data.clientY)
      store.value = {
        ...data,
        point,
      }
      engine.cursor.setDragType(CursorDragType.Resize)
      if (data.axis === 'x') {
        engine.cursor.setStyle('ew-resize')
      } else if (data.axis === 'y') {
        engine.cursor.setStyle('ns-resize')
      }
    }
  })

  engine.subscribeTo(DragMoveEvent, (event) => {
    if (engine.cursor.type !== CursorType.Normal) return
    if (store.value) {
      const { axis, type, node, element, point } = store.value
      const allowResize = node.allowResize()
      if (!allowResize) return
      const resizable = node.designerProps.resizable
      const rect = element.getBoundingClientRect()
      const current = new Point(event.data.clientX, event.data.clientY)
      const plusX = type === 'x-end' ? current.x > point.x : current.x < point.x
      const plusY = type === 'y-end' ? current.y > point.y : current.y < point.y
      const allowX = allowResize.includes('x')
      const allowY = allowResize.includes('y')
      const width = resizable.width?.(node, element)
      const height = resizable.height?.(node, element)
      if (axis === 'x') {
        if (plusX && type === 'x-end' && current.x < rect.x + rect.width) return
        if (!plusX && type === 'x-end' && current.x > rect.x + rect.width)
          return
        if (plusX && type === 'x-start' && current.x > rect.x) return
        if (!plusX && type === 'x-start' && current.x < rect.x) return
        if (allowX) {
          if (plusX) {
            width.plus()
          } else {
            width.minus()
          }
        }
      } else if (axis === 'y') {
        if (plusY && type === 'y-end' && current.y < rect.y + rect.height)
          return
        if (!plusY && type === 'y-end' && current.y > rect.y + rect.height)
          return
        if (plusY && type === 'y-start' && current.y > rect.y) return
        if (!plusY && type === 'y-start' && current.y < rect.y) return
        if (allowY) {
          if (plusY) {
            height.plus()
          } else {
            height.minus()
          }
        }
      }
      store.value.point = current
    }
  })

  engine.subscribeTo(DragStopEvent, () => {
    if (engine.cursor.type !== CursorType.Normal) return
    if (store.value) {
      store.value = null
      engine.cursor.setDragType(CursorDragType.Normal)
      engine.cursor.setStyle('')
    }
  })
}
