import { Engine, CursorType, CursorDragType } from '../models'
import { DragStartEvent, DragMoveEvent, DragStopEvent } from '../events'
import { TreeNode } from '../models'
import { Point } from '@designable/shared'

type TranslateData = {
  element?: HTMLElement
  node?: TreeNode
  point?: Point
}

type TranslateStore = {
  value?: TranslateData
}

export const useTranslateEffect = (engine: Engine) => {
  const findStartNodeHandler = (target: HTMLElement): TranslateData => {
    const handler = target?.closest(`*[${engine.props.nodeTranslateAttrName}]`)
    if (handler) {
      const type = handler.getAttribute(engine.props.nodeTranslateAttrName)
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

  const store: TranslateStore = {}

  engine.subscribeTo(DragStartEvent, (event) => {
    const target = event.data.target as HTMLElement
    const data = findStartNodeHandler(target)
    if (data) {
      const point = new Point(event.data.clientX, event.data.clientY)
      store.value = {
        ...data,
        point,
      }
      engine.cursor.setDragType(CursorDragType.Translate)
    }
  })

  engine.subscribeTo(DragMoveEvent, (event) => {
    if (engine.cursor.type !== CursorType.Normal) return
    if (store.value) {
      const { node, element, point } = store.value
      const allowTranslate = node.allowTranslate()
      if (!allowTranslate) return
      const translatable = node.designerProps.translatable
      const current = new Point(event.data.clientX, event.data.clientY)
      const diffX = current.x - point?.x
      const diffY = current.y - point?.y
      const horizontal = translatable.x?.(node, element, diffX)
      const vertical = translatable.y?.(node, element, diffY)
      horizontal.translate()
      vertical.translate()
      store.value.point = current
    }
  })

  engine.subscribeTo(DragStopEvent, () => {
    if (store.value) {
      store.value = null
      engine.cursor.setDragType(CursorDragType.Normal)
    }
  })
}
