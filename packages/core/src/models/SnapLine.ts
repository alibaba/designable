import {
  calcRectOfAxisLineSegment,
  ILineSegment,
  IPoint,
  calcOffsetOfSnapLineSegmentToEdge,
} from '@designable/shared'
import { TreeNode } from './TreeNode'
import { TranslateHelper } from './TranslateHelper'

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
  ctx: TranslateHelper
  constructor(ctx: TranslateHelper, line: ISnapLine) {
    this.ctx = ctx
    this.type = line.type || 'normal'
    this._id = line.id
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
    return this.distance < TranslateHelper.threshold
  }

  get rect() {
    return calcRectOfAxisLineSegment(this)
  }

  getTranslate(node: TreeNode) {
    if (!node || !node?.parent) return
    const parent = node.parent
    const dragNodeRect = node.getValidElementOffsetRect()
    const parentRect = parent.getValidElementOffsetRect()
    const edgeOffset = calcOffsetOfSnapLineSegmentToEdge(this, dragNodeRect)
    if (this.direction === 'h') {
      return this.start.y - parentRect.y - edgeOffset.y
    } else {
      return this.start.x - parentRect.x - edgeOffset.x
    }
  }
}
