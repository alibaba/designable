import { Operation } from './Operation'
import { TreeNode } from './TreeNode'
import { observable, define, action } from '@formily/reactive'
import {
  calcDistanceOfPointToRect,
  calcDistancePointToEdge,
  isFn,
  isNearAfter,
  isPointInRect,
  IPoint,
} from '@designable/shared'
import { DragNodeEvent, DropNodeEvent } from '../events'
import { Viewport } from './Viewport'

export enum ClosestDirection {
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

export interface IDragonProps {
  operation: Operation
  viewport: Viewport
  sensitive?: boolean
  forceBlock?: boolean
}

export interface IDragonCalculateProps {
  touchNode: TreeNode
  point?: IPoint
  closestNode?: TreeNode
  closestDirection?: ClosestDirection
}
export class Dragon {
  operation: Operation

  rootNode: TreeNode

  dragNodes: TreeNode[] = []

  touchNode: TreeNode = null

  dropNode: TreeNode = null

  closestNode: TreeNode = null

  closestRect: DOMRect = null

  closestOffsetRect: DOMRect = null

  closestDirection: ClosestDirection = null

  sensitive = true

  forceBlock = false

  viewport: Viewport = null

  constructor(props: IDragonProps) {
    this.operation = props.operation
    this.viewport = props.viewport
    this.sensitive = props.sensitive
    this.forceBlock = props.forceBlock
    this.rootNode = this.operation.tree
    this.makeObservable()
  }

  /**
   * 相对最近节点的位置
   * @readonly
   * @type {ClosestDirection}
   * @memberof Dragon
   */
  getClosestDirection(point: IPoint): ClosestDirection {
    const closestNode = this.closestNode
    if (!closestNode) return ClosestDirection.Forbid
    const closestNodeParent = closestNode.parent
    const closestRect = this.viewport.getValidNodeRect(closestNode)
    const isInline =
      this.closestNode?.designerProps?.inlineLayout ||
      closestNodeParent?.designerProps?.inlineChildrenLayout
    if (!closestRect) {
      return
    }
    const isAfter = isNearAfter(
      point,
      closestRect,
      this.forceBlock ? false : isInline
    )
    if (isPointInRect(point, closestRect, this.sensitive)) {
      if (!closestNode.allowAppend(this.dragNodes)) {
        if (!closestNode.allowSibling(this.dragNodes)) {
          if (isInline) {
            return isAfter
              ? ClosestDirection.ForbidAfter
              : ClosestDirection.ForbidBefore
          } else {
            return isAfter
              ? ClosestDirection.ForbidUnder
              : ClosestDirection.ForbidUpper
          }
        } else {
          if (isInline) {
            return isAfter ? ClosestDirection.After : ClosestDirection.Before
          } else {
            return isAfter ? ClosestDirection.Under : ClosestDirection.Upper
          }
        }
      }
      if (closestNode.contains(...this.dragNodes)) {
        return isAfter
          ? ClosestDirection.InnerAfter
          : ClosestDirection.InnerBefore
      } else {
        return ClosestDirection.Inner
      }
    } else if (closestNode === closestNode.root) {
      return isAfter
        ? ClosestDirection.InnerAfter
        : ClosestDirection.InnerBefore
    } else {
      if (!closestNode.allowSibling(this.dragNodes)) {
        if (isInline) {
          return isAfter
            ? ClosestDirection.ForbidAfter
            : ClosestDirection.ForbidBefore
        } else {
          return isAfter
            ? ClosestDirection.ForbidUnder
            : ClosestDirection.ForbidUpper
        }
      }
      if (isInline) {
        return isAfter ? ClosestDirection.After : ClosestDirection.Before
      } else {
        return isAfter ? ClosestDirection.Under : ClosestDirection.Upper
      }
    }
  }

  setClosestDirection(direction: ClosestDirection) {
    this.closestDirection = direction
  }

  /**
   * 拖拽过程中最近的节点
   *
   * @readonly
   * @type {TreeNode}
   * @memberof Dragon
   */
  getClosestNode(point: IPoint): TreeNode {
    if (this.touchNode) {
      const touchNodeRect = this.viewport.getValidNodeRect(this.touchNode)
      if (!touchNodeRect) return
      if (this.touchNode?.children?.length) {
        const touchDistance = calcDistancePointToEdge(point, touchNodeRect)
        let minDistance = touchDistance
        let minDistanceNode = this.touchNode
        this.touchNode.eachChildren((node) => {
          const rect = this.viewport.getElementRectById(node.id)
          if (!rect) return
          const distance = isPointInRect(point, rect, this.sensitive)
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
    return null
  }

  setClosestNode(node: TreeNode) {
    this.closestNode = node
  }

  /**
   * 从最近的节点中计算出节点矩形
   *
   * @readonly
   * @type {DOMRect}
   * @memberof Dragon
   */
  getClosestRect(): DOMRect {
    const closestNode = this.closestNode
    const closestDirection = this.closestDirection
    if (!closestNode || !closestDirection) return
    const closestRect = this.viewport.getValidNodeRect(closestNode)
    if (
      closestDirection === ClosestDirection.InnerAfter ||
      closestDirection === ClosestDirection.InnerBefore
    ) {
      return this.viewport.getChildrenRect(closestNode)
    } else {
      return closestRect
    }
  }

  setClosestRect(rect: DOMRect) {
    this.closestRect = rect
  }

  getClosestOffsetRect(): DOMRect {
    const closestNode = this.closestNode
    const closestDirection = this.closestDirection
    if (!closestNode || !closestDirection) return
    const closestRect = this.viewport.getValidNodeOffsetRect(closestNode)
    if (
      closestDirection === ClosestDirection.InnerAfter ||
      closestDirection === ClosestDirection.InnerBefore
    ) {
      return this.viewport.getChildrenOffsetRect(closestNode)
    } else {
      return closestRect
    }
  }

  setClosestOffsetRect(rect: DOMRect) {
    this.closestOffsetRect = rect
  }

  setDragNodes(nodes: TreeNode[] = []) {
    const dragNodes: TreeNode[] = nodes.reduce((buf, node) => {
      if (isFn(node?.designerProps?.getDragNodes)) {
        const transformed = node.designerProps.getDragNodes(node)
        return transformed ? buf.concat(transformed) : buf
      }
      return buf.concat([node])
    }, [])
    this.dragNodes = dragNodes
    this.trigger(
      new DragNodeEvent({
        target: this.operation.tree,
        source: dragNodes,
      })
    )
  }

  setTouchNode(node?: TreeNode) {
    this.touchNode = node
    if (!node) {
      this.closestNode = null
      this.closestDirection = null
      this.closestOffsetRect = null
      this.closestRect = null
    }
  }

  calculate(props: IDragonCalculateProps) {
    const { point, touchNode, closestNode, closestDirection } = props
    this.setTouchNode(touchNode)
    this.closestNode = closestNode || this.getClosestNode(point)
    this.closestDirection = closestDirection || this.getClosestDirection(point)
    this.closestRect = this.getClosestRect()
    this.closestOffsetRect = this.getClosestOffsetRect()
  }

  setDropNode(node: TreeNode) {
    this.dropNode = node
    this.trigger(
      new DropNodeEvent({
        target: this.operation.tree,
        source: node,
      })
    )
  }

  trigger(event: any) {
    if (this?.operation) {
      return this.operation.dispatch(event)
    }
  }

  clear() {
    this.dragNodes = []
    this.touchNode = null
    this.dropNode = null
    this.closestNode = null
    this.closestDirection = null
    this.closestOffsetRect = null
    this.closestRect = null
  }

  makeObservable() {
    define(this, {
      dragNodes: observable.shallow,
      touchNode: observable.ref,
      closestNode: observable.ref,
      closestDirection: observable.ref,
      closestRect: observable.ref,
      setDragNodes: action,
      setTouchNode: action,
      setDropNode: action,
      setClosestNode: action,
      setClosestDirection: action,
      setClosestOffsetRect: action,
      setClosestRect: action,
      clear: action,
      calculate: action,
    })
  }
}
