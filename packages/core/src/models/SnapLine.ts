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
  node?: TreeNode
}

export class SnapLine {
  _id: string
  distance: number
  node: TreeNode
  start: IPoint
  end: IPoint
  ctx: DragLine
  constructor(ctx: DragLine, line: IDynamicSnapLine) {
    this.ctx = ctx
    this._id = line.id
    this.node = line.node
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
    if (!this.node || !this.node?.parent) return
    const node = this.node
    const parent = this.node.parent
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
    return this.node?.getDraggingVertexOffset()
  }
}
