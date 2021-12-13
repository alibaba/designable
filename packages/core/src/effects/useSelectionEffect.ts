import { Designer, CursorStatus } from '../models'
import { MouseClickEvent } from '../events'
import { KeyCode, Point } from '@designable/shared'

export const useSelectionEffect = (designer: Designer) => {
  designer.subscribeTo(MouseClickEvent, (event) => {
    if (designer.cursor.status !== CursorStatus.Normal) return
    const target: HTMLElement = event.data.target as any
    const el = target?.closest?.(`
      *[${designer.props.nodeIdAttrName}],
      *[${designer.props.outlineNodeIdAttrName}]
    `)
    const isHelpers = target?.closest?.(
      `*[${designer.props.nodeSelectionIdAttrName}]`
    )
    const currentWorkspace =
      event.context.workspace ?? designer.workbench.activeWorkspace
    if (!currentWorkspace) return
    if (!el?.getAttribute) {
      const point = new Point(event.data.topClientX, event.data.topClientY)
      const operation = currentWorkspace.operation
      const viewport = currentWorkspace.viewport
      const outline = currentWorkspace.outline
      const isInViewport = viewport.isPointInViewport(point, false)
      const isInOutline = outline.isPointInViewport(point, false)
      if (isHelpers) return
      if (isInViewport || isInOutline) {
        const selection = operation.selection
        const tree = operation.tree
        selection.select(tree)
      }
      return
    }
    const nodeId = el.getAttribute(designer.props.nodeIdAttrName)
    const structNodeId = el.getAttribute(designer.props.outlineNodeIdAttrName)
    const operation = currentWorkspace.operation
    const selection = operation.selection
    const tree = operation.tree
    const node = tree.findById(nodeId || structNodeId)
    if (node) {
      designer.keyboard.requestClean()
      if (
        designer.keyboard.isKeyDown(KeyCode.Meta) ||
        designer.keyboard.isKeyDown(KeyCode.Control)
      ) {
        if (selection.has(node)) {
          if (selection.selected.length > 1) {
            selection.remove(node)
          }
        } else {
          selection.add(node)
        }
      } else if (designer.keyboard.isKeyDown(KeyCode.Shift)) {
        if (selection.has(node)) {
          if (selection.selected.length > 1) {
            selection.remove(node)
          }
        } else {
          selection.crossAddTo(node)
        }
      } else {
        selection.select(node, true)
      }
    } else {
      selection.select(tree, true)
    }
  })
}
