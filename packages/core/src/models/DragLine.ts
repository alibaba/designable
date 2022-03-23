import {
  ISnapLineSegment,
  ILineSegment,
  isSnapLineSegment,
  Point,
  IPoint,
  calcEdgeLinesOfRect,
  calcCursorEdgeLinesOfRect,
  calcClosestEdgeLines,
  calcDistanceOfLienSegment,
} from '@designable/shared'
import { observable, define, action } from '@formily/reactive'
import { Operation } from './Operation'
import { TreeNode } from './TreeNode'
import { SnapLine } from './SnapLine'

export type IDynamicSnapLine = ISnapLineSegment & {
  id?: string
  node?: TreeNode
}

export interface IDragLineProps {
  operation: Operation
}
export class DragLine {
  operation: Operation

  fixedSnapLines: SnapLine[] = []

  dynamicSnapLines: SnapLine[] = []

  distanceLines: ILineSegment[] = []

  spaceLines: ILineSegment[] = []

  cursorToVertexOffsets: Record<string, IPoint> = {}

  snapLineDistances: Record<string, number> = {}

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

  get closestSnapLines() {
    const lines: SnapLine[] = []
    this.dynamicSnapLines.forEach((line) => {
      lines.push(line)
    })
    this.fixedSnapLines.forEach((line) => {
      if (line.closest) {
        lines.push(line)
      }
    })
    return lines
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

  getCursorToVertexOffsets(nodes: TreeNode[] = []) {
    return nodes.map((node) => this.cursorToVertexOffsets[node.id])
  }

  getNodeUnLimitVertex(node: TreeNode) {
    const offset = node.getCursorOffset()
    return new Point(this.cursor.x - offset.x, this.cursor.y - offset.y)
  }

  getDraggingVertexOffset(node: TreeNode) {
    const unLimit = this.getNodeUnLimitVertex(node)
    const limit = node.getValidElementOffsetRect()
    return new Point(unLimit.x - limit.x, unLimit.y - limit.y)
  }

  calcDynamicSnapLines(nodes: TreeNode[] = []) {
    if (!nodes.length) return
    this.operation.tree.eachTree((target) => {
      if (nodes.includes(target)) return
      const targetRect = target.getValidElementOffsetRect()
      nodes.forEach((node) => {
        if (node.contains(target) || target.contains(node)) return
        const rect = node.getValidElementOffsetRect()
        const targetLines = calcEdgeLinesOfRect(targetRect)
        const cursorLines = calcCursorEdgeLinesOfRect(
          rect,
          this.cursor,
          node.getCursorOffset()
        )
        const combineLines = calcClosestEdgeLines(
          targetLines,
          cursorLines,
          DragLine.threshold
        )
        combineLines.h.forEach((line) => {
          this.dynamicSnapLines.push(
            new SnapLine(this, {
              node,
              ...line,
            })
          )
        })
        combineLines.v.forEach((line) => {
          this.dynamicSnapLines.push(
            new SnapLine(this, {
              node,
              ...line,
            })
          )
        })
      })
    })
  }

  calcDistanceLines(nodes: TreeNode[] = []) {}

  calcFixedSnapLines(nodes: TreeNode[] = []) {
    if (!nodes.length) return
    this.fixedSnapLines.forEach((fixedLine) => {
      nodes.forEach((node) => {
        const rect = node.getElementOffsetRect()
        const cursorLines = calcCursorEdgeLinesOfRect(
          rect,
          this.cursor,
          node.getCursorOffset()
        )
        if (fixedLine.direction === 'h') {
          const minDistance = Math.min(
            ...cursorLines.h.map((line) =>
              calcDistanceOfLienSegment(line, fixedLine)
            )
          )
          fixedLine.distance = minDistance
          fixedLine.node = node
        } else {
          const minDistance = Math.min(
            ...cursorLines.v.map((line) =>
              calcDistanceOfLienSegment(line, fixedLine)
            )
          )
          fixedLine.distance = minDistance
          fixedLine.node = node
        }
      })
    })
  }

  findFixedSnapLine(id: string) {
    return this.fixedSnapLines.find((item) => item.id === id)
  }

  addFixedSnapLine(line: IDynamicSnapLine) {
    if (!isSnapLineSegment(line)) return
    const matchedLineIndex = this.fixedSnapLines.findIndex(
      (item) => item.id === line.id
    )
    if (matchedLineIndex == -1) {
      this.fixedSnapLines.push(new SnapLine(this, line))
    }
  }

  removeFixedSnapLine(id: string) {
    const matchedLineIndex = this.fixedSnapLines.findIndex(
      (item) => item.id === id
    )
    if (matchedLineIndex > -1) {
      this.fixedSnapLines.splice(matchedLineIndex, 1)
    }
  }

  calcDragLine(nodes: TreeNode[] = []) {
    this.dynamicSnapLines = []
    this.calcDynamicSnapLines(nodes)
    this.calcFixedSnapLines(nodes)
    this.calcDistanceLines(nodes)
  }

  cleanDragLine() {
    this.dynamicSnapLines = []
    this.cursorToVertexOffsets = {}
    this.snapLineDistances = {}
  }

  makeObservable() {
    define(this, {
      fixedSnapLines: observable.shallow,
      dynamicSnapLines: observable.shallow,
      spaceLines: observable.shallow,
      distanceLines: observable.shallow,
      calcDragLine: action,
      calcDistanceLines: action,
      calcDynamicSnapLines: action,
      calcFixedSnapLines: action,
      cleanDragLine: action,
    })
  }

  static threshold = 5
}
