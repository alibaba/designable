import {
  calcAlignLineSegmentOfEdgeToRectAndCursor,
  calcRectOfAxisLineSegment,
  IAlignLineSegment,
  ILineSegment,
  isAlignLineSegment,
  calcDistanceOfEdgeToAlignLineSegment,
  calcOffsetOfAlignLineSegmentToEdge,
  Point,
  IPoint,
  uid,
} from '@designable/shared'
import { observable, define, action } from '@formily/reactive'
import { Operation } from './Operation'
import { TreeNode } from './TreeNode'

const ALIGN_LINE_LIMIT_BOUNDARY = 5

const isKissingAlignLine = (
  line: IDynamicAlignLine,
  bufferLine: IDynamicAlignLine
) => {
  if (line && bufferLine) {
    const offset = line.node?.getDraggingVertexOffset()
    const outerOffset = offset?.x === 0 && offset?.y === 0
    const isNear = line.distance < ALIGN_LINE_LIMIT_BOUNDARY
    if (bufferLine.distance > line.distance && isNear && outerOffset) {
      return true
    } else if (isNear) {
      const isVertical = line.start.x === line.end.x
      if (isVertical) {
        if (Math.abs(offset?.x) > ALIGN_LINE_LIMIT_BOUNDARY + 3) {
          return false
        }
      } else {
        if (Math.abs(offset?.y) > ALIGN_LINE_LIMIT_BOUNDARY + 3) {
          return false
        }
      }
      return true
    }
    return false
  }
  return false
}

export type IDynamicAlignLine = IAlignLineSegment<{
  id?: string
  node?: TreeNode
}>

export interface IDragLineProps {
  operation: Operation
}
export class AlignLine {
  _id: string
  _distance: number
  node: TreeNode
  start: IPoint
  end: IPoint
  ctx: DragLine
  isKissing = false
  constructor(ctx: DragLine, line: IDynamicAlignLine) {
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
    return this.distance < ALIGN_LINE_LIMIT_BOUNDARY
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
    const edgeOffset = calcOffsetOfAlignLineSegmentToEdge(this, selfRef)
    return new AlignLine(this.ctx, {
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

  set distance(distance: number) {
    const oldDistance = this.ctx.alignLineDistances[this.id]
    const offset = this.vertexOffset
    const isUnSucking = offset?.x === 0 && offset?.y === 0
    const allowSuck = distance < ALIGN_LINE_LIMIT_BOUNDARY
    if (oldDistance !== undefined) {
      if (oldDistance > distance && allowSuck && isUnSucking) {
        this.isKissing = true
      } else {
        if (this.direction === 'v') {
          if (Math.abs(offset?.x) > ALIGN_LINE_LIMIT_BOUNDARY + 3) {
            this.isKissing = false
          } else {
            this.isKissing = true
          }
        } else {
          if (Math.abs(offset?.y) > ALIGN_LINE_LIMIT_BOUNDARY + 3) {
            this.isKissing = false
          } else {
            this.isKissing = true
          }
        }
      }
    }
    this.ctx.alignLineDistances[this.id] = distance
    this._distance = distance
  }

  get distance() {
    return this._distance
  }
}

export class DragLine {
  operation: Operation

  fixedAlignLines: AlignLine[] = []

  dynamicAlignLines: AlignLine[] = []

  distanceLines: ILineSegment[] = []

  spaceLines: ILineSegment[] = []

  cursorToVertexOffsets: Record<string, IPoint> = {}

  alignLineDistances: Record<string, number> = {}

  constructor(props: IDragLineProps) {
    this.operation = props.operation
    this.makeObservable()
  }

  get cursor() {
    const position = this.operation.engine.cursor.position
    return this.operation.workspace.viewport.getOffsetPoint(
      new Point(position.clientX, position.clientY)
    )
  }

  get kissingAlignLines() {
    const dynamics = this.dynamicAlignLines.filter((line) => line.isKissing)
    const fixed = this.fixedAlignLines.filter((line) => line.isKissing)
    return [...dynamics, ...fixed]
  }

  markCursorToVertexOffsets(nodes: TreeNode[] = []) {
    nodes.forEach((node) => {
      const rect = node.getValidElementOffsetRect()
      this.cursorToVertexOffsets[node.id] = new Point(
        this.cursor.x - rect.x,
        this.cursor.y - rect.y
      )
    })
  }

  clean() {
    this.cursorToVertexOffsets = {}
  }

  getCursorToVertexOffsets(nodes: TreeNode[] = []) {
    return nodes.map((node) => this.cursorToVertexOffsets[node.id])
  }

  getDraggingUnLimitVertex(node: TreeNode) {
    const offset = node.getCursorOffset()
    return new Point(this.cursor.x - offset.x, this.cursor.y - offset.y)
  }

  getDraggingVertexOffset(node: TreeNode) {
    const unLimit = this.getDraggingUnLimitVertex(node)
    const limit = node.getValidElementOffsetRect()
    return new Point(unLimit.x - limit.x, unLimit.y - limit.y)
  }

  calcDynamicAlignLines(nodes: TreeNode[] = []) {
    if (!nodes.length) return
    this.operation.tree.eachTree((target) => {
      if (nodes.includes(target)) return
      nodes.forEach((node) => {
        const { vertical, horizontal } =
          calcAlignLineSegmentOfEdgeToRectAndCursor(
            node.getValidElementOffsetRect(),
            target.getValidElementOffsetRect()
          )
        if (vertical.distance < ALIGN_LINE_LIMIT_BOUNDARY) {
          this.dynamicAlignLines.push(
            new AlignLine(this, {
              node,
              ...vertical,
            })
          )
        }
        if (horizontal.distance < ALIGN_LINE_LIMIT_BOUNDARY) {
          this.dynamicAlignLines.push(
            new AlignLine(this, {
              node,
              ...horizontal,
            })
          )
        }
      })
    })
  }

  calcDistanceLines(nodes: TreeNode[] = []) {}

  calcFixedAlignLines(nodes: TreeNode[] = []) {
    if (!nodes.length) return
    this.fixedAlignLines.forEach((line) => {
      nodes.forEach((node) => {
        const rect = node.getElementOffsetRect()
        line.distance = calcDistanceOfEdgeToAlignLineSegment(rect, line)
      })
    })
  }

  findFixedAlignLine(id: string) {
    return this.fixedAlignLines.find((item) => item.id === id)
  }

  addFixedAlignLine(line: IDynamicAlignLine) {
    if (!isAlignLineSegment(line)) return
    const matchedLineIndex = this.fixedAlignLines.findIndex(
      (item) => item.id === line.id
    )
    if (matchedLineIndex == -1) {
      this.fixedAlignLines.push(new AlignLine(this, line))
    }
  }

  removeFixedAlignLine(id: string) {
    const matchedLineIndex = this.fixedAlignLines.findIndex(
      (item) => item.id === id
    )
    if (matchedLineIndex > -1) {
      this.fixedAlignLines.splice(matchedLineIndex, 1)
    }
  }

  calcDragLine(nodes: TreeNode[] = []) {
    this.dynamicAlignLines = []
    this.calcDynamicAlignLines(nodes)
    this.calcFixedAlignLines(nodes)
    this.calcDistanceLines(nodes)
  }

  makeObservable() {
    define(this, {
      fixedAlignLines: observable.shallow,
      dynamicAlignLines: observable.shallow,
      spaceLines: observable.shallow,
      distanceLines: observable.shallow,
      calcDragLine: action,
      calcDistanceLines: action,
      calcDynamicAlignLines: action,
      calcFixedAlignLines: action,
      clean: action,
    })
  }
}
