import {
  calcRectOfAxisLineSegment,
  ILineSegment,
  IPoint,
  Rect,
} from '@designable/shared'
import { TransformHelper } from './TransformHelper'

export type ISnapLineType = 'ruler' | 'space-block' | 'normal'

export type ISnapLine = ILineSegment & {
  type?: ISnapLineType
  distance?: number
  offset?: number
  edge?: string
  id?: string
}

export class SnapLine {
  _id: string
  type: ISnapLineType
  distance: number
  offset: number
  start: IPoint
  edge: string
  end: IPoint
  helper: TransformHelper
  constructor(helper: TransformHelper, line: ISnapLine) {
    this.helper = helper
    this.type = line.type || 'normal'
    this._id = line.id
    this.start = { ...line.start }
    this.end = { ...line.end }
    this.edge = line.edge
    this.offset = line.offset
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
    return this.distance < TransformHelper.threshold
  }

  get rect() {
    return calcRectOfAxisLineSegment(this)
  }

  getClosestEdge(rect: Rect) {
    const threshold = TransformHelper.threshold
    if (this.direction === 'h') {
      if (Math.abs(this.start.y - rect.top) < threshold) return 'ht'
      if (Math.abs(this.start.y - (rect.top + rect.height / 2)) < threshold)
        return 'hc'
      if (Math.abs(this.start.y - rect.bottom) < threshold) return 'hb'
    } else {
      if (Math.abs(this.start.x - rect.left) < threshold) return 'vl'
      if (Math.abs(this.start.x - (rect.left + rect.width / 2)) < threshold)
        return 'vc'
      if (Math.abs(this.start.x - rect.right) < threshold) return 'vr'
    }
  }
}
