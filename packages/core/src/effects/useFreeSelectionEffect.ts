import { DragStopEvent } from '../events/index'
import { Engine, CursorType, TreeNode, CursorDragType } from '../models/index'
import {
  calcRectByStartEndPoint,
  isCrossRectInRect,
  isRectInRect,
  Point,
} from '@designable/shared'

export const useFreeSelectionEffect = (engine: Engine) => {
  engine.subscribeTo(DragStopEvent, (event) => {
    if (engine.cursor.dragType !== CursorDragType.Move) {
      return
    }
    engine.workbench.eachWorkspace((workspace) => {
      const viewport = workspace.viewport
      const dragEndPoint = new Point(
        event.data.topClientX ?? 0,
        event.data.topClientY ?? 0
      )
      const dragStartX = engine.cursor.dragStartPosition?.topClientX ?? 0
      const dragStartY = engine.cursor.dragStartPosition?.topClientY ?? 0
      const dragStartOffsetPoint = viewport.getOffsetPoint(
        new Point(dragStartX, dragStartY)
      )
      const dragEndOffsetPoint = viewport.getOffsetPoint(
        new Point(
          engine.cursor.position.topClientX ?? 0,
          engine.cursor.position.topClientY ?? 0
        )
      )
      if (!viewport.isPointInViewport(dragEndPoint, false)) return
      const tree = workspace.operation.tree
      const selectionRect = calcRectByStartEndPoint(
        dragStartOffsetPoint,
        dragEndOffsetPoint,
        viewport.dragScrollXDelta,
        viewport.dragScrollYDelta
      )
      const selected: [TreeNode, DOMRect][] = []
      tree.eachChildren((node) => {
        const nodeRect = viewport.getValidNodeOffsetRect(node)
       if (
          nodeRect &&
          isCrossRectInRect(selectionRect, nodeRect as DOMRectReadOnly)
        ) {
          selected.push([node, nodeRect as DOMRectReadOnly])
        }
      })
      const selectedNodes: TreeNode[] = selected.reduce<TreeNode[]>((buf, [node, nodeRect]) => {
        if (isRectInRect(nodeRect, selectionRect)) {
          if (selected.some(([selectNode]) => selectNode.isMyParents(node))) {
            return buf
          }
          if (node) {
            buf.push(node)
          }
        }
        return buf
      }, [])
      workspace.operation.selection.batchSafeSelect(selectedNodes ?? [])
    })
    if (engine.cursor.type === CursorType.Selection) {
      engine.cursor.setType(CursorType.Normal)
    }
  })
}
