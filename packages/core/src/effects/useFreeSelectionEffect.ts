import { DragStopEvent } from '../events'
import { Engine, CursorType, TreeNode } from '../models'
import {
  calcRectByStartEndPoint,
  isCrossRectInRect,
  isRectInRect,
  Point,
} from '@inbiz/shared'

export const useFreeSelectionEffect = (engine: Engine) => {
  engine.subscribeTo(DragStopEvent, (event) => {
    if (engine.cursor.type !== CursorType.Selection) return
    engine.workbench.eachWorkspace((workspace) => {
      const viewport = workspace.viewport
      const dragStartPoint = new Point(
        engine.cursor.dragStartPosition.topClientX,
        engine.cursor.dragStartPosition.topClientY
      )
      const dragStartOffsetPoint = viewport.getOffsetPoint(
        new Point(
          engine.cursor.dragStartPosition.topClientX,
          engine.cursor.dragStartPosition.topClientY
        )
      )
      const dragEndOffsetPoint = viewport.getOffsetPoint(
        new Point(
          engine.cursor.position.topClientX,
          engine.cursor.position.topClientY
        )
      )
      if (!viewport.isPointInViewport(dragStartPoint, false)) return
      const tree = workspace.operation.tree
      const selectionRect = calcRectByStartEndPoint(
        dragStartOffsetPoint,
        dragEndOffsetPoint,
        viewport.scrollX - engine.cursor.dragStartScrollOffset.scrollX,
        viewport.scrollY - engine.cursor.dragStartScrollOffset.scrollY
      )
      const selected: [TreeNode, DOMRect][] = []
      tree.eachChildren((node) => {
        const nodeRect = viewport.getValidNodeOffsetRect(node)
        if (nodeRect && isCrossRectInRect(selectionRect, nodeRect)) {
          selected.push([node, nodeRect])
        }
      })
      const selectedNodes: TreeNode[] = selected.reduce(
        (buf, [node, nodeRect]) => {
          if (isRectInRect(nodeRect, selectionRect)) {
            if (selected.some(([selectNode]) => selectNode.isMyParents(node))) {
              return buf
            }
          }
          return buf.concat(node)
        },
        []
      )
      workspace.operation.selection.batchSafeSelect(selectedNodes)
    })
    engine.cursor.setType(CursorType.Move)
  })
}
