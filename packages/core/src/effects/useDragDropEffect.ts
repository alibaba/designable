import { Engine, ClosestDirection, CursorType } from '../models'
import {
  DragStartEvent,
  DragMoveEvent,
  DragStopEvent,
  ViewportScrollEvent,
} from '../events'
import { Point } from '@designable/shared'

export const useDragDropEffect = (engine: Engine) => {
  engine.subscribeTo(DragStartEvent, (event) => {
    if (engine.cursor.type !== CursorType.Move) return
    const target = event.data.target as HTMLElement
    const el = target?.closest(`
       *[${engine.props.nodeIdAttrName}],
       *[${engine.props.sourceIdAttrName}],
       *[${engine.props.outlineNodeIdAttrName}]
      `)
    if (!el?.getAttribute) return
    const sourceId = el?.getAttribute(engine.props.sourceIdAttrName)
    const outlineId = el?.getAttribute(engine.props.outlineNodeIdAttrName)
    const nodeId = el?.getAttribute(engine.props.nodeIdAttrName)
    engine.workbench.eachWorkspace((currentWorkspace) => {
      const operation = currentWorkspace.operation

      if (nodeId || outlineId) {
        const node = engine.findNodeById(outlineId || nodeId)
        if (operation.focusNode && operation.focusNode.contains(node)) {
          operation.setDragNodes([operation.focusNode])
          return
        } else {
          operation.focusClean()
        }
        if (node) {
          if (node?.designerProps?.draggable === false) return
          if (node === node.root) return
          const validSelected = engine.getAllSelectedNodes().filter((node) => {
            if (node) {
              return (
                node?.designerProps?.draggable !== false && node !== node.root
              )
            }
            return false
          })
          if (validSelected.some((selectNode) => selectNode === node)) {
            operation.setDragNodes(operation.sortNodes(validSelected))
          } else {
            operation.setDragNodes([node])
          }
        }
      } else if (sourceId) {
        const sourceNode = engine.findSourceNodeById(sourceId)
        if (sourceNode) {
          if (sourceNode?.designerProps?.draggable === false) return
          operation.setDragNodes([sourceNode])
        }
      }
    })
  })

  engine.subscribeTo(DragMoveEvent, (event) => {
    if (engine.cursor.type !== CursorType.Move) return
    const target = event.data.target as HTMLElement
    const el = target?.closest(`
      *[${engine.props.nodeIdAttrName}],
      *[${engine.props.outlineNodeIdAttrName}]
    `)
    const nodeId = el?.getAttribute(engine.props.nodeIdAttrName)
    const outlineId = el?.getAttribute(engine.props.outlineNodeIdAttrName)
    engine.workbench.eachWorkspace((currentWorkspace) => {
      const operation = currentWorkspace.operation
      const tree = operation.tree
      const point = new Point(event.data.topClientX, event.data.topClientY)
      const dragNodes = operation.getDragNodes()
      if (!dragNodes.length) return
      const touchNode = tree.findById(outlineId || nodeId)
      operation.dragWith(point, touchNode)
    })
  })

  engine.subscribeTo(ViewportScrollEvent, (event) => {
    if (engine.cursor.type !== CursorType.Move) return
    const point = new Point(
      engine.cursor.position.topClientX,
      engine.cursor.position.topClientY
    )
    const currentWorkspace = event?.context?.workspace
    if (!currentWorkspace) return
    const operation = currentWorkspace.operation
    if (!operation.getDragNodes()?.length) return
    const tree = operation.tree
    const viewport = currentWorkspace.viewport
    const outline = currentWorkspace.outline
    const viewportTarget = viewport.elementFromPoint(point)
    const outlineTarget = outline.elementFromPoint(point)
    const viewportNodeElement = viewportTarget?.closest(`
      *[${engine.props.nodeIdAttrName}],
      *[${engine.props.outlineNodeIdAttrName}]
    `)
    const outlineNodeElement = outlineTarget?.closest(`
    *[${engine.props.nodeIdAttrName}],
    *[${engine.props.outlineNodeIdAttrName}]
  `)
    const nodeId = viewportNodeElement?.getAttribute(
      engine.props.nodeIdAttrName
    )
    const outlineNodeId = outlineNodeElement?.getAttribute(
      engine.props.outlineNodeIdAttrName
    )
    const touchNode = tree.findById(outlineNodeId || nodeId)
    operation.dragWith(point, touchNode)
  })

  engine.subscribeTo(DragStopEvent, () => {
    if (engine.cursor.type !== CursorType.Move) return

    engine.workbench.eachWorkspace((currentWorkspace) => {
      const operation = currentWorkspace.operation
      const dragNodes = operation.getDragNodes()
      const closestNode = operation.getClosestNode()
      const closestDirection = operation.getClosestDirection()
      const selection = operation.selection
      if (!dragNodes.length) return
      if (dragNodes.length && closestNode && closestDirection) {
        if (
          closestDirection === ClosestDirection.After ||
          closestDirection === ClosestDirection.Under
        ) {
          if (closestNode.allowSibling(dragNodes)) {
            selection.batchSafeSelect(closestNode.insertAfter(...dragNodes))
          }
        } else if (
          closestDirection === ClosestDirection.Before ||
          closestDirection === ClosestDirection.Upper
        ) {
          if (closestNode.allowSibling(dragNodes)) {
            selection.batchSafeSelect(closestNode.insertBefore(...dragNodes))
          }
        } else if (
          closestDirection === ClosestDirection.Inner ||
          closestDirection === ClosestDirection.InnerAfter
        ) {
          if (closestNode.allowAppend(dragNodes)) {
            selection.batchSafeSelect(closestNode.appendNode(...dragNodes))
            operation.setDropNode(closestNode)
          }
        } else if (closestDirection === ClosestDirection.InnerBefore) {
          if (closestNode.allowAppend(dragNodes)) {
            selection.batchSafeSelect(closestNode.prependNode(...dragNodes))
            operation.setDropNode(closestNode)
          }
        }
      }
      operation.dragClean()
    })
  })
}
