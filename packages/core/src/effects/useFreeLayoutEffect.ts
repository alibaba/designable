import { Engine, CursorType } from '../models'
import { DragStartEvent, DragMoveEvent, DragStopEvent } from '../events'
import { TreeNode } from '../models'
import { Point } from '@designable/shared'

type FreeLayoutData = {
  element?: HTMLElement
  node?: TreeNode
  point?: Point
}

type FreeLayoutStore = {
  value?: FreeLayoutData
}

export const useFreeLayoutEffect = (engine: Engine) => {
  const findStartNodeHandler = (target: HTMLElement): FreeLayoutData => {
    const handler = target?.closest(`*[${engine.props.nodeFreeLayoutAttrName}]`)
    if (handler) {
      const type = handler.getAttribute(engine.props.nodeFreeLayoutAttrName)
      if (type) {
        const element = handler.closest(
          `*[${engine.props.nodeSelectionIdAttrName}]`
        ) as HTMLElement
        if (element) {
          const nodeId = element.getAttribute(
            engine.props.nodeSelectionIdAttrName
          )
          if (nodeId) {
            const node = engine.findNodeById(nodeId)
            if (node) {
              return { node, element }
            }
          }
        }
      }
    }
    return
  }

  const store: FreeLayoutStore = {}

  engine.subscribeTo(DragStartEvent, (event) => {
    if (engine.cursor.type !== CursorType.Move) return
    const target = event.data.target as HTMLElement
    const data = findStartNodeHandler(target)
    if (data) {
      const point = new Point(event.data.clientX, event.data.clientY)
      store.value = {
        ...data,
        point,
      }
    }
  })

  engine.subscribeTo(DragMoveEvent, (event) => {
    if (engine.cursor.type !== CursorType.Move) return
    if (store.value) {
      const { node, element, point } = store.value
      const allowFreeLayout = node.allowFreeLayout()
      if (!allowFreeLayout) return
      const freeLayout = node.designerProps.freeLayout
      const current = new Point(event.data.clientX, event.data.clientY)
      const diffX = current.x - point?.x
      const diffY = current.y - point?.y
      const horizontal = freeLayout.horizontal?.(node, element, diffX)
      const vertical = freeLayout.vertical?.(node, element, diffY)
      horizontal.setFreeLayout()
      vertical.setFreeLayout()
      store.value.point = current
    }
  })

  engine.subscribeTo(DragStopEvent, () => {
    if (engine.cursor.type !== CursorType.Move) return
    if (store.value) {
      store.value = null
    }
  })
}
