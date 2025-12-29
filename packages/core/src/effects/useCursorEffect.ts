import { Engine, CursorStatus } from '../models/index'
import {
  MouseMoveEvent,
  DragStartEvent,
  DragMoveEvent,
  DragStopEvent,
} from '../events/index'
import { requestIdle } from '@designable/shared'

export const useCursorEffect = (engine: Engine) => {
  engine.subscribeTo(MouseMoveEvent, (event) => {
    engine.cursor.setStatus(
      engine.cursor.status === CursorStatus.Dragging ||
        engine.cursor.status === CursorStatus.DragStart
        ? engine.cursor.status
        : CursorStatus.Normal
    )
    if (engine.cursor.status === CursorStatus.Dragging) return
    engine.cursor.setPosition(event.data)
  })
  engine.subscribeTo(DragStartEvent, (event) => {
    engine.cursor.setStatus(CursorStatus.DragStart)
    engine.cursor.setDragStartPosition(event.data)
  })
  engine.subscribeTo(DragMoveEvent, (event) => {
    engine.cursor.setStatus(CursorStatus.Dragging)
    engine.cursor.setPosition(event.data)
  })
  engine.subscribeTo(DragStopEvent, (event) => {
    engine.cursor.setStatus(CursorStatus.DragStop)
    engine.cursor.setDragEndPosition(event.data)
    engine.cursor.setDragStartPosition(undefined)
    requestIdle(() => {
      engine.cursor.setStatus(CursorStatus.Normal)
    })
  })
  engine.subscribeTo(MouseMoveEvent, (event) => {
    const currentWorkspace = event?.context?.workspace
    if (!currentWorkspace) return
    const operation = currentWorkspace.operation
    if (engine.cursor.status !== CursorStatus.Normal) {
      operation.hover.clear()
      return
    }
    const target = event.data.target as HTMLElement
    const el = target?.closest?.(`
      *[${engine.props.nodeIdAttrName}],
      *[${engine.props.outlineNodeIdAttrName}]
    `)
    if (!el?.getAttribute) {
      return
    }
    const nodeIdAttr = typeof engine.props.nodeIdAttrName === 'string' ? engine.props.nodeIdAttrName : '';
    const outlineNodeIdAttr = typeof engine.props.outlineNodeIdAttrName === 'string' ? engine.props.outlineNodeIdAttrName : '';
    const nodeId = nodeIdAttr ? (el.getAttribute(nodeIdAttr) ?? '') : '';
    const outlineNodeId = outlineNodeIdAttr ? (el.getAttribute(outlineNodeIdAttr) ?? '') : '';
    const node = operation.tree.findById(nodeId !== '' ? nodeId : outlineNodeId)
    if (node) {
      operation.hover.setHover(node)
    } else {
      operation.hover.clear()
    }
  })
}
