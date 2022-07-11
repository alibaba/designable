import { CursorType, Engine, Workspace } from '../models'
import {
  DragStartEvent,
  DragMoveEvent,
  DragStopEvent,
  KeyDownEvent,
  KeyUpEvent,
  ViewportScrollEvent,
} from '../events'
import { ICustomEvent, KeyCode } from '@designable/shared'

export const useTransformEffect = (engine: Engine) => {
  const pickWorkspace = <E extends ICustomEvent>(
    starter: (workspace: Workspace, target: HTMLElement, event: E) => void
  ) => {
    return (event: E) => {
      const target = event.data.target as HTMLElement
      const currentWorkspace =
        event.context?.workspace ?? engine.workbench.activeWorkspace
      if (currentWorkspace) {
        starter(currentWorkspace, target, event)
      }
    }
  }

  const getResizeHandler = (target: HTMLElement) => {
    const handler = target?.closest(
      `*[${engine.props.nodeResizeHandlerAttrName}]`
    ) as any
    if (!handler) return
    const direction = handler.getAttribute(
      engine.props.nodeResizeHandlerAttrName
    )
    return { handler, direction }
  }

  const getRotateHandler = (target: HTMLElement) => {
    const handler = target?.closest(
      `*[${engine.props.nodeRotateHandlerAttrName}]`
    ) as any
    if (!handler) return
    return { handler }
  }

  engine.subscribeTo(
    KeyDownEvent,
    pickWorkspace((workspace, target, event) => {
      const helper = workspace.operation.transformHelper
      if (event.data === KeyCode.Meta) {
        helper.startCommandMode()
      }
      if (event.data === KeyCode.Alt) {
        helper.startOptionMode()
      }
      if (event.data === KeyCode.Shift) {
        helper.startLockMode()
      }
    })
  )

  engine.subscribeTo(
    KeyUpEvent,
    pickWorkspace((workspace, target, event) => {
      const helper = workspace.operation.transformHelper
      if (event.data === KeyCode.Meta) {
        helper.cancelCommandMode()
      }
      if (event.data === KeyCode.Alt) {
        helper.cancelOptionMode()
      }
      if (event.data === KeyCode.Shift) {
        helper.cancelLockMode()
      }
    })
  )

  engine.subscribeTo(
    DragStartEvent,
    pickWorkspace((workspace, target) => {
      if (engine.cursor.type !== CursorType.Transform) return
      const operation = workspace.operation
      const helper = operation.transformHelper
      const resizeHandler = getResizeHandler(target)
      const rotateHandler = getRotateHandler(target)

      if (resizeHandler) {
        helper.dragStart({
          direction: resizeHandler.direction,
          type: 'resize',
        })
      } else if (rotateHandler) {
        helper.dragStart({
          type: 'rotate',
        })
      } else {
        const element = target?.closest(`
        *[${engine.props.nodeIdAttrName}],
        *[${engine.props.sourceIdAttrName}]
       `)
        if (!element) return
        const sourceId = element.getAttribute(engine.props.sourceIdAttrName)
        const nodeId = element.getAttribute(engine.props.nodeIdAttrName)
        const selection = operation.selection
        const targetNode = operation.tree.findById(nodeId || sourceId)
        const selectedNodes = selection.selectedNodes
        const hasSelected = selectedNodes.includes(targetNode)
        const dragNodes = hasSelected ? selectedNodes : [targetNode]
        if (!hasSelected) {
          selection.select(targetNode)
        }
        helper.dragStart({
          dragNodes: dragNodes,
          type: 'translate',
        })
      }
    })
  )

  engine.subscribeTo(
    DragMoveEvent,
    pickWorkspace((workspace) => {
      const helper = workspace.operation.transformHelper
      const dragNodes = helper.dragNodes
      if (!dragNodes.length) return
      helper.dragMove()
    })
  )
  engine.subscribeTo(
    ViewportScrollEvent,
    pickWorkspace((workspace) => {
      const helper = workspace.operation.transformHelper
      const dragNodes = helper.dragNodes
      if (!dragNodes.length) return
      helper.dragMove()
    })
  )
  engine.subscribeTo(
    DragStopEvent,
    pickWorkspace((workspace) => {
      const helper = workspace.operation.transformHelper
      const dragNodes = helper.dragNodes
      if (!dragNodes.length) return
      workspace.operation.transformHelper.dragEnd()
    })
  )
}
