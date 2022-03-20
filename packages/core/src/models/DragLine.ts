import {
  IAlignLineSegment,
  ILineSegment,
  isAlignLineSegment,
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
import { AlignLine } from './AlignLine'

export type IDynamicAlignLine = IAlignLineSegment & {
  id?: string
  node?: TreeNode
}

export interface IDragLineProps {
  operation: Operation
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

  get closestAlignLines() {
    const lines: AlignLine[] = []
    this.dynamicAlignLines.forEach((line) => {
      lines.push(line)
    })
    this.fixedAlignLines.forEach((line) => {
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

  calcDynamicAlignLines(nodes: TreeNode[] = []) {
    if (!nodes.length) return
    this.operation.tree.eachTree((target) => {
      if (nodes.includes(target)) return
      const targetRect = target.getValidElementOffsetRect()
      nodes.forEach((node) => {
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
          this.dynamicAlignLines.push(
            new AlignLine(this, {
              node,
              ...line,
            })
          )
        })
        combineLines.v.forEach((line) => {
          this.dynamicAlignLines.push(
            new AlignLine(this, {
              node,
              ...line,
            })
          )
        })
      })
    })
  }

  calcDistanceLines(nodes: TreeNode[] = []) {}

  calcFixedAlignLines(nodes: TreeNode[] = []) {
    if (!nodes.length) return
    this.fixedAlignLines.forEach((fixedLine) => {
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

  cleanDragLine() {
    this.dynamicAlignLines = []
    this.cursorToVertexOffsets = {}
    this.alignLineDistances = {}
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
      cleanDragLine: action,
    })
  }

  static threshold = 8
}
