import {
  calcRectOfAxisLineSegment,
  ISnapLineSegment,
  IPoint,
  calcOffsetOfSnapLineSegmentToEdge,
} from '@designable/shared'
import { TreeNode } from './TreeNode'
import { DragLine } from './DragLine'

export type IDynamicSnapLine = ISnapLineSegment & {
  id?: string
  target?: TreeNode
  refer?: TreeNode
}

export class SnapLine {
  _id: string
  distance: number
  target: TreeNode
  refer: TreeNode
  start: IPoint
  end: IPoint
  ctx: DragLine
  constructor(ctx: DragLine, line: IDynamicSnapLine) {
    this.ctx = ctx
    this._id = line.id
    this.target = line.target
    this.refer = line.refer
    this.start = { ...line.start }
    this.end = { ...line.end }
    this.distance = line.distance
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
    return this.distance < DragLine.threshold
  }

  get rect() {
    return calcRectOfAxisLineSegment(this)
  }

  get relativeFromNodeVertex() {
    if (!this.target || !this.target?.parent) return
    const node = this.target
    const parent = this.target.parent
    const selfRef = node.getValidElementOffsetRect()
    const parentRect = parent.getValidElementOffsetRect()
    const edgeOffset = calcOffsetOfSnapLineSegmentToEdge(this, selfRef)
    return new SnapLine(this.ctx, {
      ...this,
      start: {
        x: this.start.x - parentRect.x - edgeOffset.x,
        y: this.start.y - parentRect.y - edgeOffset.y,
      },
      end: {
        x: this.end.x - parentRect.x - edgeOffset.x,
        y: this.end.y - parentRect.y - edgeOffset.y,
      },
    })
  }

  get vertexOffset() {
    return this.target?.getDraggingVertexOffset()
  }
}
