import { Engine, CursorDragType } from '../models'
import { DragStartEvent, DragMoveEvent, DragStopEvent } from '../events'

export const useTranslateEffect = (engine: Engine) => {
  engine.subscribeTo(DragStartEvent, (event) => {
    const target = event.data.target as HTMLElement
    const currentWorkspace =
      event.context?.workspace ?? engine.workbench.activeWorkspace
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
              currentWorkspace?.operation.translateHelper.dragStart([node])
            }
          }
        }
      }
    }
  })
  engine.subscribeTo(DragMoveEvent, (event) => {
    if (engine.cursor.dragType !== CursorDragType.Translate) return
    const currentWorkspace =
      event.context?.workspace ?? engine.workbench.activeWorkspace
    const translateHelper = currentWorkspace?.operation.translateHelper
    const dragNodes = translateHelper.dragNodes
    const allowTranslate = dragNodes.every((node) => node.allowTranslate())
    if (!dragNodes.length || !allowTranslate) return
    translateHelper.dragMove()
    dragNodes.forEach((node) => {
      const element = node.getElement()
      translateHelper.translate(node, (translate) => {
        element.style.position = 'absolute'
        element.style.left = '0px'
        element.style.top = '0px'
        element.style.transform = `translate3d(${translate.x}px,${translate.y}px,0)`
      })
    })
  })
  engine.subscribeTo(DragStopEvent, (event) => {
    const currentWorkspace =
      event.context?.workspace ?? engine.workbench.activeWorkspace
    const translateHelper = currentWorkspace?.operation.translateHelper
    if (translateHelper) {
      translateHelper.dragEnd()
    }
  })
}
