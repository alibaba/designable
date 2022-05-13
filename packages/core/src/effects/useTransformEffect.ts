import { Engine, Workspace } from '../models'
import {
  DragStartEvent,
  DragMoveEvent,
  DragStopEvent,
  KeyDownEvent,
  KeyUpEvent,
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
  const getNodeFromHandler = (handler: HTMLElement) => {
    if (!handler) return
    const element = handler.closest(
      `*[${engine.props.nodeSelectionIdAttrName}]`
    )
    const nodeId = element.getAttribute(engine.props.nodeSelectionIdAttrName)
    return engine.findNodeById(nodeId)
  }
  const getTranslateHandler = (target: HTMLElement) => {
    const handler = target?.closest(
      `*[${engine.props.nodeTranslateAttrName}]`
    ) as any
    if (!handler) return
    const node = getNodeFromHandler(handler)
    return { handler, node }
  }
  const getResizeHandler = (target: HTMLElement) => {
    const handler = target?.closest(
      `*[${engine.props.nodeResizeHandlerAttrName}]`
    ) as any
    if (!handler) return
    const direction = handler.getAttribute(
      engine.props.nodeResizeHandlerAttrName
    )
    const node = getNodeFromHandler(handler)
    return { node, handler, direction }
  }

  const getRotateHandler = (target: HTMLElement) => {
    const handler = target?.closest(
      `*[${engine.props.nodeRotateHandlerAttrName}]`
    ) as any
    if (!handler) return
    const node = getNodeFromHandler(handler)
    return { node, handler }
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
      const helper = workspace.operation.transformHelper
      const translateHandler = getTranslateHandler(target)
      const resizeHandler = getResizeHandler(target)
      const rotateHandler = getRotateHandler(target)
      if (translateHandler) {
        helper.dragStart({
          dragNodes: [translateHandler.node],
          type: 'translate',
        })
      } else if (resizeHandler) {
        helper.dragStart({
          dragNodes: [resizeHandler.node],
          direction: resizeHandler.direction,
          type: 'resize',
        })
      } else if (rotateHandler) {
        helper.dragStart({
          dragNodes: [rotateHandler.node],
          type: 'rotate',
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
    DragStopEvent,
    pickWorkspace((workspace) => {
      const helper = workspace.operation.transformHelper
      const dragNodes = helper.dragNodes
      if (!dragNodes.length) return
      workspace.operation.transformHelper.dragEnd()
    })
  )
}
