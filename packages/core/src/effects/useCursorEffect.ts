import { Designer, CursorStatus } from '../models'
import {
  MouseMoveEvent,
  DragStartEvent,
  DragMoveEvent,
  DragStopEvent,
} from '../events'
import { requestIdle } from '@designable/shared'

export const useCursorEffect = (designer: Designer) => {
  designer.subscribeTo(MouseMoveEvent, (event) => {
    designer.cursor.setStatus(
      designer.cursor.status === CursorStatus.Dragging ||
        designer.cursor.status === CursorStatus.DragStart
        ? designer.cursor.status
        : CursorStatus.Normal
    )
    designer.cursor.setPosition(event.data)
  })
  designer.subscribeTo(DragStartEvent, (event) => {
    designer.cursor.setStatus(CursorStatus.DragStart)
    designer.cursor.setDragStartPosition(event.data)
  })
  let cleanStatusRequest = null
  designer.subscribeTo(DragMoveEvent, () => {
    designer.cursor.setStatus(CursorStatus.Dragging)
    clearTimeout(cleanStatusRequest)
    cleanStatusRequest = setTimeout(() => {
      designer.cursor.setStatus(CursorStatus.Normal)
    }, 1000)
  })
  designer.subscribeTo(DragStopEvent, (event) => {
    clearTimeout(cleanStatusRequest)
    designer.cursor.setStatus(CursorStatus.DragStop)
    designer.cursor.setDragEndPosition(event.data)
    requestIdle(() => {
      designer.cursor.setStatus(CursorStatus.Normal)
    })
  })
  designer.subscribeTo(MouseMoveEvent, (event) => {
    const currentWorkspace = event?.context?.workspace
    if (!currentWorkspace) return
    const operation = currentWorkspace.operation
    if (designer.cursor.status !== CursorStatus.Normal) {
      operation.hover.clear()
      return
    }
    const target = event.data.target as HTMLElement
    const el = target?.closest?.(`
      *[${designer.props.nodeIdAttrName}],
      *[${designer.props.outlineNodeIdAttrName}]
    `)
    if (!el?.getAttribute) {
      return
    }
    const nodeId = el.getAttribute(designer.props.nodeIdAttrName)
    const outlineNodeId = el.getAttribute(designer.props.outlineNodeIdAttrName)
    const node = operation.tree.findById(nodeId || outlineNodeId)
    if (node) {
      operation.hover.setHover(node)
    } else {
      operation.hover.clear()
    }
  })
}
