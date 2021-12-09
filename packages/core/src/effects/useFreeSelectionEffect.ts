import { DragStopEvent } from '../events'
import { Designer, CursorType, TreeNode } from '../models'
import {
  calcRectByStartEndPoint,
  isCrossRectInRect,
  isRectInRect,
  Point,
} from '@designable/shared'

export const useFreeSelectionEffect = (designer: Designer) => {
  designer.subscribeTo(DragStopEvent, (event) => {
    if (designer.cursor.type !== CursorType.Selection) return
    designer.workbench.eachWorkspace((workspace) => {
      const viewport = workspace.viewport
      const dragStartPoint = new Point(
        designer.cursor.dragStartPosition.topClientX,
        designer.cursor.dragStartPosition.topClientY
      )
      const dragStartOffsetPoint = viewport.getOffsetPoint(
        new Point(
          designer.cursor.dragStartPosition.topClientX,
          designer.cursor.dragStartPosition.topClientY
        )
      )
      const dragEndOffsetPoint = viewport.getOffsetPoint(
        new Point(
          designer.cursor.position.topClientX,
          designer.cursor.position.topClientY
        )
      )
      if (!viewport.isPointInViewport(dragStartPoint, false)) return
      const tree = workspace.operation.tree
      const selectionRect = calcRectByStartEndPoint(
        dragStartOffsetPoint,
        dragEndOffsetPoint,
        viewport.scrollX - designer.cursor.dragStartScrollOffset.scrollX,
        viewport.scrollY - designer.cursor.dragStartScrollOffset.scrollY
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
    designer.cursor.setType(CursorType.Move)
  })
}
