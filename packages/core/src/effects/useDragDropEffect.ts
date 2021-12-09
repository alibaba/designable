import { Designer, ClosestPosition, CursorType } from '../models'
import {
  DragStartEvent,
  DragMoveEvent,
  DragStopEvent,
  ViewportScrollEvent,
} from '../events'
import { Point } from '@designable/shared'

export const useDragDropEffect = (designer: Designer) => {
  designer.subscribeTo(DragStartEvent, (event) => {
    if (designer.cursor.type !== CursorType.Move) return
    const target = event.data.target as HTMLElement
    const el = target?.closest(`
       *[${designer.props.nodeIdAttrName}],
       *[${designer.props.sourceIdAttrName}],
       *[${designer.props.outlineNodeIdAttrName}]
      `)
    const handler = target?.closest(
      `*[${designer.props.nodeDragHandlerAttrName}]`
    )
    const helper = handler?.closest(
      `*[${designer.props.nodeSelectionIdAttrName}]`
    )
    if (!el?.getAttribute && !handler) return
    const sourceId = el?.getAttribute(designer.props.sourceIdAttrName)
    const outlineId = el?.getAttribute(designer.props.outlineNodeIdAttrName)
    const handlerId = helper?.getAttribute(
      designer.props.nodeSelectionIdAttrName
    )
    const nodeId = el?.getAttribute(designer.props.nodeIdAttrName)
    designer.workbench.eachWorkspace((currentWorkspace) => {
      const operation = currentWorkspace.operation

      if (nodeId || outlineId || handlerId) {
        const node = designer.findNodeById(outlineId || nodeId || handlerId)
        if (node) {
          if (!node.allowDrag()) return
          if (node === node.root) return
          const validSelected = designer
            .getAllSelectedNodes()
            .filter((node) => node.allowDrag())
          if (validSelected.some((selectNode) => selectNode === node)) {
            operation.setDragNodes(operation.sortNodes(validSelected))
          } else {
            operation.setDragNodes([node])
          }
        }
      } else if (sourceId) {
        const sourceNode = designer.findNodeById(sourceId)
        if (sourceNode) {
          if (!sourceNode.allowDrag()) return
          operation.setDragNodes([sourceNode])
        }
      }
    })
    designer.cursor.setStyle('move')
  })

  designer.subscribeTo(DragMoveEvent, (event) => {
    if (designer.cursor.type !== CursorType.Move) return
    const target = event.data.target as HTMLElement
    const el = target?.closest(`
      *[${designer.props.nodeIdAttrName}],
      *[${designer.props.outlineNodeIdAttrName}]
    `)
    const nodeId = el?.getAttribute(designer.props.nodeIdAttrName)
    const outlineId = el?.getAttribute(designer.props.outlineNodeIdAttrName)
    designer.workbench.eachWorkspace((currentWorkspace) => {
      const operation = currentWorkspace.operation
      const tree = operation.tree
      const point = new Point(event.data.topClientX, event.data.topClientY)
      const dragNodes = operation.getDragNodes()
      if (!dragNodes.length) return
      const touchNode = tree.findById(outlineId || nodeId)
      operation.dragWith(point, touchNode)
    })
  })

  designer.subscribeTo(ViewportScrollEvent, (event) => {
    if (designer.cursor.type !== CursorType.Move) return
    const point = new Point(
      designer.cursor.position.topClientX,
      designer.cursor.position.topClientY
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
      *[${designer.props.nodeIdAttrName}],
      *[${designer.props.outlineNodeIdAttrName}]
    `)
    const outlineNodeElement = outlineTarget?.closest(`
    *[${designer.props.nodeIdAttrName}],
    *[${designer.props.outlineNodeIdAttrName}]
  `)
    const nodeId = viewportNodeElement?.getAttribute(
      designer.props.nodeIdAttrName
    )
    const outlineNodeId = outlineNodeElement?.getAttribute(
      designer.props.outlineNodeIdAttrName
    )
    const touchNode = tree.findById(outlineNodeId || nodeId)
    operation.dragWith(point, touchNode)
  })

  designer.subscribeTo(DragStopEvent, () => {
    if (designer.cursor.type !== CursorType.Move) return

    designer.workbench.eachWorkspace((currentWorkspace) => {
      const operation = currentWorkspace.operation
      const dragNodes = operation.getDragNodes()
      const closestNode = operation.getClosestNode()
      const closestDirection = operation.getClosestPosition()
      const selection = operation.selection
      if (!dragNodes.length) return
      if (dragNodes.length && closestNode && closestDirection) {
        if (
          closestDirection === ClosestPosition.After ||
          closestDirection === ClosestPosition.Under
        ) {
          if (closestNode.allowSibling(dragNodes)) {
            selection.batchSafeSelect(
              closestNode.insertAfter(
                ...operation.getDropNodes(closestNode.parent)
              )
            )
          }
        } else if (
          closestDirection === ClosestPosition.Before ||
          closestDirection === ClosestPosition.Upper
        ) {
          if (closestNode.allowSibling(dragNodes)) {
            selection.batchSafeSelect(
              closestNode.insertBefore(
                ...operation.getDropNodes(closestNode.parent)
              )
            )
          }
        } else if (
          closestDirection === ClosestPosition.Inner ||
          closestDirection === ClosestPosition.InnerAfter
        ) {
          if (closestNode.allowAppend(dragNodes)) {
            selection.batchSafeSelect(
              closestNode.append(...operation.getDropNodes(closestNode))
            )
            operation.setDropNode(closestNode)
          }
        } else if (closestDirection === ClosestPosition.InnerBefore) {
          if (closestNode.allowAppend(dragNodes)) {
            selection.batchSafeSelect(
              closestNode.prepend(...operation.getDropNodes(closestNode))
            )
            operation.setDropNode(closestNode)
          }
        }
      }
      operation.dragClean()
    })
    designer.cursor.setStyle('')
  })
}
