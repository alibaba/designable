import { Engine, CursorDragType } from '../models'
import { DragStartEvent, DragMoveEvent, DragStopEvent } from '../events'
import { TreeNode } from '../models'
import { IPoint, Point } from '@designable/shared'

type TranslateData = {
  startPoint?: IPoint
  node?: TreeNode
}

type TranslateStore = {
  value?: TranslateData
}

const parseTranslatePoint = (element: HTMLElement) => {
  const transform = element?.style?.transform
  if (transform) {
    const [x, y] = transform
      .match(
        /translate(?:3d)?\(\s*([-\d.]+)[a-z]+?[\s,]+([-\d.]+)[a-z]+?(?:[\s,]+([-\d.]+))?[a-z]+?\s*\)/
      )
      ?.slice(1, 3) ?? [0, 0]

    return new Point(Number(x), Number(y))
  } else {
    return new Point(Number(element.offsetLeft), Number(element.offsetTop))
  }
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
      let translateX = startPoint.x + deltaX,
        translateY = startPoint.y + deltaY

      dragLine.calcDragLine([node])
      dragLine.closestSnapLines.forEach((line) => {
        if (line.direction === 'h') {
          translateY = line.relativeFromNodeVertex?.start?.y
        } else {
          translateX = line.relativeFromNodeVertex?.start?.x
        }
      })

      element.style.position = 'absolute'
      element.style.left = '0px'
      element.style.top = '0px'
      element.style.transform = `translate3d(${translateX}px,${translateY}px,0)`
    }
  })

  engine.subscribeTo(DragStopEvent, () => {
    if (store.value) {
      store.value.node.operation.dragLine.cleanDragLine()
      store.value = null
      engine.cursor.setDragType(CursorDragType.Normal)
    }
  })
}
