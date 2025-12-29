import {
  ILineSegment,
  IPoint,
  IRect,
  calcOffsetOfSnapLineSegmentToEdge,
  calcRectOfAxisLineSegment,
} from '@designable/shared'
import { TreeNode } from './TreeNode'
import { TransformHelper } from './TransformHelper'

export type ISnapLineType = 'ruler' | 'space-block' | 'normal'

export type ISnapLine = ILineSegment & {
  type?: ISnapLineType
  distance?: number
  id?: string
  refer?: TreeNode
}

export class SnapLine {
  _id: string
  type: ISnapLineType
  distance: number
  refer: TreeNode
  start: IPoint
  end: IPoint
  helper: TransformHelper
  constructor(helper: TransformHelper, line: ISnapLine) {
    this.helper = helper
    this.type = line.type || 'normal'
    this._id = line.id ?? ''
    this.refer = line.refer ?? ({} as TreeNode)
    this.start = { ...line.start }
    this.end = { ...line.end }
    this.distance = line.distance ?? 0
  }

  get id() {
    return (
      this._id ?? `${this.start.x}-${this.start.y}-${this.end.x}-${this.end.y}`
    )
  }

  get direction() {
    if (this.start?.x === this.end?.x) return 'v'
    return 'h'
  }

  get closest() {
    return this.distance < TransformHelper.threshold
  }

  get rect() {
    return calcRectOfAxisLineSegment(this)
  }

  translate(node: TreeNode, translate: IPoint) {
    if (!node || !node?.parent) return
    const parent = node.parent
    const dragNodeRect = node.getValidElementOffsetRect()
    const parentRect = parent.getValidElementOffsetRect()
    if (!dragNodeRect || !parentRect) return
    const edgeOffset = calcOffsetOfSnapLineSegmentToEdge(this, dragNodeRect)
    if (this.direction === 'h') {
      translate.y = this.start.y - parentRect.y - edgeOffset.y
    } else {
      translate.x = this.start.x - parentRect.x - edgeOffset.x
    }
  }

  resize(node: TreeNode, rect: IRect) {
    if (!node || !node?.parent) return
    const parent = node.parent
    const dragNodeRect = node.getValidElementOffsetRect()
    const parentRect = parent.getValidElementOffsetRect()
    const cursorRect = this.helper.cursorDragNodesRect
    if (!dragNodeRect || !parentRect || !cursorRect) return
    const edgeOffset = calcOffsetOfSnapLineSegmentToEdge(this, dragNodeRect)
    const snapEdge = this.snapEdge(rect)
    if (this.direction === 'h') {
      const y = this.start.y - parentRect.y - edgeOffset.y
      switch (this.helper.direction) {
        case 'left-top':
        case 'center-top':
        case 'right-top':
          if (snapEdge !== 'ht') return
          rect.y = y
          rect.height = cursorRect.bottom - y
          break
        case 'left-bottom':
        case 'center-bottom':
        case 'right-bottom':
          if (snapEdge !== 'hb') return
          rect.height = this.start.y - cursorRect.top
          break
      }
    } else {
      const x = this.start.x - parentRect.x - edgeOffset.x
      switch (this.helper.direction) {
        case 'left-top':
        case 'left-bottom':
        case 'left-center':
          if (snapEdge !== 'vl') return
          rect.x = x
          rect.width = cursorRect.right - x
          break
        case 'right-center':
        case 'right-top':
        case 'right-bottom':
          if (snapEdge !== 'vr') return
          rect.width = this.start.x - cursorRect.left
          break
      }
    }
  }

  snapEdge(rect: IRect) {
    const threshold = TransformHelper.threshold
    // Accept both IRect and Rect (which implements IRect)
    const top = (rect as any).top ?? (rect as any).y ?? 0
    const left = (rect as any).left ?? (rect as any).x ?? 0
    const width = (rect as any).width ?? 0
    const height = (rect as any).height ?? 0
    const bottom = (rect as any).bottom ?? (typeof height === 'number' ? top + height : 0)
    const right = (rect as any).right ?? (typeof width === 'number' ? left + width : 0)
    if (this.direction === 'h') {
      if (Math.abs(this.start.y - top) < threshold) return 'ht'
      if (Math.abs(this.start.y - (top + height / 2)) < threshold)
        return 'hc'
      if (Math.abs(this.start.y - bottom) < threshold) return 'hb'
    } else {
      if (Math.abs(this.start.x - left) < threshold) return 'vl'
      if (Math.abs(this.start.x - (left + width / 2)) < threshold)
        return 'vc'
      if (Math.abs(this.start.x - right) < threshold) return 'vr'
    }
  }
}
