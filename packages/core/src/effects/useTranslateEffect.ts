import { Engine, CursorDragType } from '../models'
import { DragStartEvent, DragMoveEvent, DragStopEvent } from '../events'
import { TreeNode } from '../models'
import { IPoint, parseTranslatePoint } from '@designable/shared'

type TranslateData = {
  startPoint?: IPoint
  node?: TreeNode
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
        const selectionElement = handler.closest(
          `*[${engine.props.nodeSelectionIdAttrName}]`
        ) as HTMLElement
        if (selectionElement) {
          const nodeId = selectionElement.getAttribute(
            engine.props.nodeSelectionIdAttrName
          )
          if (nodeId) {
            const node = engine.findNodeById(nodeId)
            if (node) {
              const element = node.getElement()
              node.markCursorOffset()
              return {
                node,
                startPoint: parseTranslatePoint(element),
              }
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
      store.value = data
      engine.cursor.setDragType(CursorDragType.Translate)
    }
  })

  engine.subscribeTo(DragMoveEvent, () => {
    if (engine.cursor.dragType !== CursorDragType.Translate) return
    if (store.value) {
      const { node, startPoint } = store.value
      const allowTranslate = node.allowTranslate()
      if (!allowTranslate) return
      const element = node.getElement()
      const deltaX = engine.cursor.dragStartToCurrentDelta.clientX
      const deltaY = engine.cursor.dragStartToCurrentDelta.clientY
      const dragLine = node.operation.dragLine
      const kissingAlignLines = dragLine.kissingAlignLines
      let translateX = startPoint.x + deltaX,
        translateY = startPoint.y + deltaY
      kissingAlignLines.forEach((line) => {
        if (line.direction === 'h') {
          translateY = line.relativeFromNodeVertex?.start?.y
        } else {
          translateX = line.relativeFromNodeVertex?.start?.x
        }
      })
      element.style.position = 'absolute'
      element.style.transform = `translate3d(${translateX}px,${translateY}px,0)`
      dragLine.calcDragLine([node])
    }
  })

  engine.subscribeTo(DragStopEvent, () => {
    if (store.value) {
      store.value.node.operation.dragLine.clean()
      store.value = null
      engine.cursor.setDragType(CursorDragType.Normal)
    }
  })
}
