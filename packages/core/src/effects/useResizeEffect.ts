import { Designer, CursorType } from '../models'
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

export const useResizeEffect = (designer: Designer) => {
  const findStartNodeHandler = (target: HTMLElement): ResizeData => {
    const handler = target?.closest(
      `*[${designer.props.nodeResizeHandlerAttrName}]`
    )
    if (handler) {
      const type = handler.getAttribute(
        designer.props.nodeResizeHandlerAttrName
      )
      if (type) {
        const element = handler.closest(
          `*[${designer.props.nodeSelectionIdAttrName}]`
        )
        if (element) {
          const nodeId = element.getAttribute(
            designer.props.nodeSelectionIdAttrName
          )
          if (nodeId) {
            const node = designer.findNodeById(nodeId)
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

  designer.subscribeTo(DragStartEvent, (event) => {
    if (designer.cursor.type !== CursorType.Move) return
    const target = event.data.target as HTMLElement
    const data = findStartNodeHandler(target)
    if (data) {
      const point = new Point(event.data.clientX, event.data.clientY)
      store.value = {
        ...data,
        point,
      }
      if (data.axis === 'x') {
        designer.cursor.setStyle('ew-resize')
      } else if (data.axis === 'y') {
        designer.cursor.setStyle('ns-resize')
      }
    }
  })

  designer.subscribeTo(DragMoveEvent, (event) => {
    if (designer.cursor.type !== CursorType.Move) return
    if (store.value) {
      const { axis, type, node, element, point } = store.value
      const allowResize = node.allowResize()
      if (!allowResize) return
      const resizable = node.behavior.resizable
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

  designer.subscribeTo(DragStopEvent, () => {
    if (designer.cursor.type !== CursorType.Move) return
    if (store.value) {
      store.value = null
      designer.cursor.setStyle('')
    }
  })
}
