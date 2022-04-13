import { Operation } from './Operation'
import { TreeNode } from './TreeNode'
import { observable, define, action } from '@formily/reactive'
import {
  calcDistanceOfPointToRect,
  calcDistancePointToEdge,
  isNearAfter,
  isPointInRect,
  IPoint,
} from '@designable/shared'
import { DragNodeEvent, DropNodeEvent } from '../events'
import { Viewport } from './Viewport'
import { CursorDragType } from './Cursor'

export enum ClosestPosition {
  Before = 'BEFORE',
  ForbidBefore = 'FORBID_BEFORE',
  After = 'After',
  ForbidAfter = 'FORBID_AFTER',
  Upper = 'UPPER',
  ForbidUpper = 'FORBID_UPPER',
  Under = 'UNDER',
  ForbidUnder = 'FORBID_UNDER',
  Inner = 'INNER',
  ForbidInner = 'FORBID_INNER',
  InnerAfter = 'INNER_AFTER',
  ForbidInnerAfter = 'FORBID_INNER_AFTER',
  InnerBefore = 'INNER_BEFORE',
  ForbidInnerBefore = 'FORBID_INNER_BEFORE',
  Forbid = 'FORBID',
}

export interface IMoveHelperProps {
  operation: Operation
}

export interface IMoveHelperDraggingProps {
  touchNode: TreeNode
  point: IPoint
}

export class MoveHelper {
  operation: Operation

  rootNode: TreeNode

  dragNodes: TreeNode[] = []

  touchNode: TreeNode = null

  closestNode: TreeNode = null

  activeViewport: Viewport = null

  viewportClosestRect: DOMRect = null

  outlineClosestRect: DOMRect = null

  viewportClosestOffsetRect: DOMRect = null

  outlineClosestOffsetRect: DOMRect = null

  viewportClosestDirection: ClosestPosition = null

  outlineClosestDirection: ClosestPosition = null

  constructor(props: IMoveHelperProps) {
    this.operation = props.operation
    this.rootNode = this.operation.tree
    this.makeObservable()
  }

  get viewport() {
    return this.operation.workspace.viewport
  }

  get outline() {
    return this.operation.workspace.outline
  }

  get hasDragNodes() {
    return this.dragNodes.length > 0
  }

  get closestDirection() {
    if (this.activeViewport === this.outline) {
      return this.outlineClosestDirection
    }
    return this.viewportClosestDirection
  }

  getClosestLayout(viewport: Viewport) {
    return viewport.getValidNodeLayout(this.closestNode)
  }

  calcClosestPosition(point: IPoint, viewport: Viewport): ClosestPosition {
    const closestNode = this.closestNode
    if (!closestNode) return ClosestPosition.Forbid
    const closestRect = viewport.getValidNodeRect(closestNode)
    const isInline = this.getClosestLayout(viewport) === 'horizontal'
    if (!closestRect) {
      return
    }
    const isAfter = isNearAfter(
      point,
      closestRect,
      viewport.moveInsertionType === 'block' ? false : isInline
    )
    const getValidParent = (node: TreeNode) => {
      if (!node) return
      if (node.parent?.allowSibling(this.dragNodes)) return node.parent
      return getValidParent(node.parent)
    }
    if (isPointInRect(point, closestRect, viewport.moveSensitive)) {
      if (!closestNode.allowAppend(this.dragNodes)) {
        if (!closestNode.allowSibling(this.dragNodes)) {
          const parentClosestNode = getValidParent(closestNode)
          if (parentClosestNode) {
            this.closestNode = parentClosestNode
          }
          if (isInline) {
            if (parentClosestNode) {
              if (isAfter) {
                return ClosestPosition.After
              }
              return ClosestPosition.Before
            }
            if (isAfter) {
              return ClosestPosition.ForbidAfter
            }
            return ClosestPosition.ForbidBefore
          } else {
            if (parentClosestNode) {
              if (isAfter) {
                return ClosestPosition.Under
              }
              return ClosestPosition.Upper
            }
            if (isAfter) {
              return ClosestPosition.ForbidUnder
            }
            return ClosestPosition.ForbidUpper
          }
        } else {
          if (isInline) {
            return isAfter ? ClosestPosition.After : ClosestPosition.Before
          } else {
            return isAfter ? ClosestPosition.Under : ClosestPosition.Upper
          }
        }
      }
      if (closestNode.contains(...this.dragNodes)) {
        if (isAfter) {
          return ClosestPosition.InnerAfter
        }
        return ClosestPosition.InnerBefore
      } else {
        return ClosestPosition.Inner
      }
    } else if (closestNode === closestNode.root) {
      return isAfter ? ClosestPosition.InnerAfter : ClosestPosition.InnerBefore
    } else {
      if (!closestNode.allowSibling(this.dragNodes)) {
        const parentClosestNode = getValidParent(closestNode)
        if (parentClosestNode) {
          this.closestNode = parentClosestNode
        }
        if (isInline) {
          if (parentClosestNode) {
            if (isAfter) {
              return ClosestPosition.After
            }
            return ClosestPosition.Before
          }
          return isAfter
            ? ClosestPosition.ForbidAfter
            : ClosestPosition.ForbidBefore
        } else {
          if (parentClosestNode) {
            if (isAfter) {
              return ClosestPosition.Under
            }
            return ClosestPosition.Upper
          }
          return isAfter
            ? ClosestPosition.ForbidUnder
            : ClosestPosition.ForbidUpper
        }
      }
      if (isInline) {
        return isAfter ? ClosestPosition.After : ClosestPosition.Before
      } else {
        return isAfter ? ClosestPosition.Under : ClosestPosition.Upper
      }
    }
  }

  calcClosestNode(point: IPoint, viewport: Viewport): TreeNode {
    if (this.touchNode) {
      const touchNodeRect = viewport.getValidNodeRect(this.touchNode)
      if (!touchNodeRect) return
      if (this.touchNode?.children?.length) {
        const touchDistance = calcDistancePointToEdge(point, touchNodeRect)
        let minDistance = touchDistance
        let minDistanceNode = this.touchNode
        this.touchNode.eachChildren((node) => {
          const rect = viewport.getElementRectById(node.id)
          if (!rect) return
          const distance = isPointInRect(point, rect, viewport.moveSensitive)
            ? 0
            : calcDistanceOfPointToRect(point, rect)
          if (distance <= minDistance) {
            minDistance = distance
            minDistanceNode = node
          }
        })
        return minDistanceNode
      } else {
        return this.touchNode
      }
    }
    return this.operation.tree
  }

  calcClosestRect(
    viewport: Viewport,
    closestDirection: ClosestPosition
  ): DOMRect {
    const closestNode = this.closestNode
    if (!closestNode || !closestDirection) return
    const closestRect = viewport.getValidNodeRect(closestNode)
    if (
      closestDirection === ClosestPosition.InnerAfter ||
      closestDirection === ClosestPosition.InnerBefore
    ) {
      return viewport.getChildrenRect(closestNode)
    } else {
      return closestRect
    }
  }

  calcClosestOffsetRect(
    viewport: Viewport,
    closestDirection: ClosestPosition
  ): DOMRect {
    const closestNode = this.closestNode
    if (!closestNode || !closestDirection) return
    const closestRect = viewport.getValidNodeOffsetRect(closestNode)
    if (
      closestDirection === ClosestPosition.InnerAfter ||
      closestDirection === ClosestPosition.InnerBefore
    ) {
      return viewport.getChildrenOffsetRect(closestNode)
    } else {
      return closestRect
    }
  }

  dragStart(dragNodes: TreeNode[] = []) {
    this.dragNodes = TreeNode.filterDraggable(dragNodes)
    this.trigger(
      new DragNodeEvent({
        target: this.operation.tree,
        source: this.dragNodes,
      })
    )
    this.operation.engine.cursor.setDragType(CursorDragType.Move)
  }

  dragMove(props: IMoveHelperDraggingProps) {
    const { point, touchNode } = props
    if (this.outline.isPointInViewport(point, false)) {
      this.activeViewport = this.outline
      this.touchNode = touchNode
      this.closestNode = this.calcClosestNode(point, this.outline)
    } else if (this.viewport.isPointInViewport(point, false)) {
      this.activeViewport = this.viewport
      this.touchNode = touchNode
      this.closestNode = this.calcClosestNode(point, this.viewport)
    }
    if (!this.activeViewport) return

    if (this.activeViewport === this.outline) {
      this.outlineClosestDirection = this.calcClosestPosition(
        point,
        this.outline
      )
      this.viewportClosestDirection = this.outlineClosestDirection
    } else {
      this.viewportClosestDirection = this.calcClosestPosition(
        point,
        this.viewport
      )
      this.outlineClosestDirection = this.viewportClosestDirection
    }
    this.outlineClosestRect = this.calcClosestRect(
      this.outline,
      this.outlineClosestDirection
    )
    this.viewportClosestRect = this.calcClosestRect(
      this.viewport,
      this.viewportClosestDirection
    )
    this.outlineClosestOffsetRect = this.calcClosestOffsetRect(
      this.outline,
      this.outlineClosestDirection
    )
    this.viewportClosestOffsetRect = this.calcClosestOffsetRect(
      this.viewport,
      this.viewportClosestDirection
    )
  }

  dropping(dropNode: TreeNode) {
    this.trigger(
      new DropNodeEvent({
        target: this.operation.tree,
        source: dropNode,
      })
    )
  }

  dragEnd() {
    this.dragNodes = []
    this.touchNode = null
    this.closestNode = null
    this.activeViewport = null
    this.outlineClosestDirection = null
    this.outlineClosestOffsetRect = null
    this.outlineClosestRect = null
    this.viewportClosestDirection = null
    this.viewportClosestOffsetRect = null
    this.viewportClosestRect = null
  }

  trigger(event: any) {
    if (this.operation) {
      return this.operation.dispatch(event)
    }
  }

  makeObservable() {
    define(this, {
      dragNodes: observable.shallow,
      touchNode: observable.ref,
      closestNode: observable.ref,
      outlineClosestDirection: observable.ref,
      outlineClosestOffsetRect: observable.ref,
      outlineClosestRect: observable.ref,
      viewportClosestDirection: observable.ref,
      viewportClosestOffsetRect: observable.ref,
      viewportClosestRect: observable.ref,
      dragStart: action,
      dragMove: action,
      dragEnd: action,
    })
  }
}
