import {
  ILineSegment,
  isSnapLineSegment,
  Point,
  IPoint,
  calcEdgeLinesOfRect,
  calcCursorEdgeLinesOfRect,
  calcClosestEdgeLines,
  calcDistanceOfLienSegment,
  calcSpaceBoxOfRect,
} from '@designable/shared'
import { observable, define, action } from '@formily/reactive'
import { SpaceBox, ISpaceBoxType } from './SpaceBox'
import { Operation } from './Operation'
import { TreeNode } from './TreeNode'
import { SnapLine, IDynamicSnapLine } from './SnapLine'

export interface IDragLineProps {
  operation: Operation
}

export type AroundSpaceBox = Record<ISpaceBoxType, SpaceBox>

export class DragLine {
  operation: Operation

  fixedSnapLines: SnapLine[] = []

  dynamicSnapLines: SnapLine[] = []

  aroundSpaceBoxes: Record<string, AroundSpaceBox> = {}

  distanceLines: ILineSegment[] = []

  spaceLines: ILineSegment[] = []

  cursorToVertexOffsets: Record<string, IPoint> = {}

  requestTimer = null

  constructor(props: IDragLineProps) {
    this.operation = props.operation
    this.makeObservable()
  }

  get dragStartPoint() {
    const position = this.operation.engine.cursor.dragStartPosition
    return this.operation.workspace.viewport.getOffsetPoint(
      new Point(position.clientX, position.clientY)
    )
  }

  get draggingPoint() {
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

  get spaceBoxes(): SpaceBox[] {
    const results = []
    for (let id in this.aroundSpaceBoxes) {
      const boxes = this.aroundSpaceBoxes[id]
      for (let type in boxes) {
        const box: SpaceBox = boxes[type]
        if (box.closest.length) {
          results.push(box)
          results.push(...box.closest)
        }
      }
    }
    return results
  }

  markCursorToVertexOffsets(nodes: TreeNode[] = []) {
    nodes.forEach((node) => {
      const rect = node.getValidElementOffsetRect()
      this.cursorToVertexOffsets[node.id] = new Point(
        this.dragStartPoint.x - rect.x,
        this.dragStartPoint.y - rect.y
      )
    })
  }

  getCursorToVertexOffsets(nodes: TreeNode[] = []) {
    return nodes.map((node) => this.cursorToVertexOffsets[node.id])
  }

  getNodeUnLimitVertex(node: TreeNode) {
    const offset = node.getCursorOffset()
    return new Point(
      this.draggingPoint.x - offset.x,
      this.draggingPoint.y - offset.y
    )
  }

  getDraggingVertexOffset(node: TreeNode) {
    const unLimit = this.getNodeUnLimitVertex(node)
    const limit = node.getValidElementOffsetRect()
    return new Point(unLimit.x - limit.x, unLimit.y - limit.y)
  }

  getAroundSpaceBoxes(target: TreeNode): AroundSpaceBox {
    const targetRect = target.getValidElementOffsetRect()
    const closestSpaces = {}
    this.operation.tree.eachTree((refer) => {
      if (refer === target) return
      const referRect = refer.getValidElementOffsetRect()
      const origin = calcSpaceBoxOfRect(targetRect, referRect)

      if (origin) {
        const spaceBox = new SpaceBox(this, {
          refer,
          target,
          ...origin,
        })
        if (!closestSpaces[origin.type]) {
          closestSpaces[origin.type] = spaceBox
        } else if (spaceBox.distance < closestSpaces[origin.type].distance) {
          closestSpaces[origin.type] = spaceBox
        }
      }
    })
    return closestSpaces as any
  }

  calcDynamicSnapLines(nodes: TreeNode[] = []) {
    if (!nodes.length) return
    this.operation.tree.eachTree((refer) => {
      if (nodes.includes(refer)) return
      const referRect = refer.getValidElementOffsetRect()
      nodes.forEach((target) => {
        if (target.contains(refer)) return
        const targetRect = target.getValidElementOffsetRect()
        const targetLines = calcEdgeLinesOfRect(referRect)
        const cursorLines = calcCursorEdgeLinesOfRect(
          targetRect,
          this.draggingPoint,
          target.getCursorOffset()
        )
        const combineLines = calcClosestEdgeLines(
          targetLines,
          cursorLines,
          DragLine.threshold
        )
        combineLines.h.forEach((line) => {
          this.dynamicSnapLines.push(
            new SnapLine(this, {
              target,
              refer,
              ...line,
            })
          )
        })
        combineLines.v.forEach((line) => {
          this.dynamicSnapLines.push(
            new SnapLine(this, {
              target,
              refer,
              ...line,
            })
          )
        })
        this.aroundSpaceBoxes[target.id] = this.getAroundSpaceBoxes(target)
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
          this.draggingPoint,
          node.getCursorOffset()
        )
        if (fixedLine.direction === 'h') {
          const minDistance = Math.min(
            ...cursorLines.h.map((line) =>
              calcDistanceOfLienSegment(line, fixedLine)
            )
          )
          fixedLine.distance = minDistance
          fixedLine.target = node
        } else {
          const minDistance = Math.min(
            ...cursorLines.v.map((line) =>
              calcDistanceOfLienSegment(line, fixedLine)
            )
          )
          fixedLine.distance = minDistance
          fixedLine.target = node
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
    this.aroundSpaceBoxes = {}
    this.calcDynamicSnapLines(nodes)
    this.calcFixedSnapLines(nodes)
    this.calcDistanceLines(nodes)
  }

  cleanDragLine() {
    this.dynamicSnapLines = []
    this.aroundSpaceBoxes = {}
    this.cursorToVertexOffsets = {}
  }

  makeObservable() {
    define(this, {
      fixedSnapLines: observable.shallow,
      dynamicSnapLines: observable.shallow,
      aroundSpaceBoxes: observable.shallow,
      spaceLines: observable.shallow,
      distanceLines: observable.shallow,
      closestSnapLines: observable.computed,
      spaceBoxes: observable.computed,
      draggingPoint: observable.computed,
      dragStartPoint: observable.computed,
      calcDragLine: action,
      calcDistanceLines: action,
      calcDynamicSnapLines: action,
      calcFixedSnapLines: action,
      cleanDragLine: action,
    })
  }

  static threshold = 4
}
