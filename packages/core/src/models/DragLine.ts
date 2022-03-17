import {
  calcAlignLineSegmentOfEdgeToRectAndCursor,
  calcRectOfAxisLineSegment,
  IAlignLineSegment,
  ILineSegment,
  cloneAlignLineSegment,
  isAlignLineSegment,
  isValidNumber,
  calcDistanceOfEdgeToAlignLineSegment,
  calcOffsetOfAlignLineSegmentToEdge,
  Point,
  IPoint,
} from '@designable/shared'
import { observable, define, action } from '@formily/reactive'
import { Operation } from './Operation'
import { TreeNode } from './TreeNode'

const SNAP_LINE_BOUNDARY = 5

const NODE_SNAP_HORIZONTAL_LINE_TYPE = '$$NODE_SNAP_HORIZONTAL_LINE$$'

const NODE_SNAP_VERTICAL_LINE_TYPE = '$$NODE_SNAP_VERTICAL_LINE$$'

const isNodeAlignLine = (line: IDynamicAlignLine) =>
  isAlignLineSegment(line) &&
  (line.id === NODE_SNAP_HORIZONTAL_LINE_TYPE ||
    line.id === NODE_SNAP_VERTICAL_LINE_TYPE)

const isKissingAlignLine = (
  line: IDynamicAlignLine,
  bufferLine: IDynamicAlignLine
) => {
  if (line && bufferLine) {
    const offset = line.node?.getDraggingVertexOffset()
    const outerOffset = offset?.x === 0 && offset?.y === 0
    const isNear = line.distance < SNAP_LINE_BOUNDARY
    if (bufferLine.distance > line.distance && isNear && outerOffset) {
      return true
    } else if (isNear) {
      const isVertical = line.start.x === line.end.x
      if (isVertical) {
        if (Math.abs(offset?.x) > SNAP_LINE_BOUNDARY + 3) {
          return false
        }
      } else {
        if (Math.abs(offset?.y) > SNAP_LINE_BOUNDARY + 3) {
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
  isKissing?: boolean
  node?: TreeNode
}>

export interface IDragLineProps {
  operation: Operation
}

export class DragLine {
  operation: Operation

  alignLines: IDynamicAlignLine[] = []

  distanceLines: ILineSegment[] = []

  spaceLines: ILineSegment[] = []

  cursorToVertexOffsets: Record<string, IPoint> = {}

  constructor(props: IDragLineProps) {
    this.operation = props.operation
    this.makeObservable()
  }

  get customAlignLines() {
    return this.alignLines.filter((line) => !isNodeAlignLine(line))
  }

  get alignVLine() {
    return this.findAlignLine(NODE_SNAP_VERTICAL_LINE_TYPE)
  }

  get alignVLineRect() {
    return calcRectOfAxisLineSegment(this.alignVLine)
  }

  get alignHLine() {
    return this.findAlignLine(NODE_SNAP_HORIZONTAL_LINE_TYPE)
  }

  get alignHLineRect() {
    return calcRectOfAxisLineSegment(this.alignHLine)
  }

  get isNearAlignVLine() {
    return this.alignVLine?.distance < SNAP_LINE_BOUNDARY
  }

  get isKissingAlignVLine() {
    return this.alignVLine?.isKissing
  }

  get isNearAlignHLine() {
    return this.alignHLine?.distance < SNAP_LINE_BOUNDARY
  }

  get isKissingAlignHLine() {
    return this.alignHLine?.isKissing
  }

  get cursor() {
    const position = this.operation.engine.cursor.position
    return this.operation.workspace.viewport.getOffsetPoint(
      new Point(position.clientX, position.clientY)
    )
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
    this.alignLines.forEach((line) => {
      line.distance = Infinity
      line.isKissing = false
      line.node = null
    })
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

  calcAlignLineOfTree(nodes: TreeNode[] = []) {
    if (!nodes.length) return
    let minDistanceAlignVLine = null,
      minDistanceAlignHLine = null
    this.operation.tree.eachTree((target) => {
      if (nodes.includes(target)) return
      nodes.forEach((node) => {
        const { vertical, horizontal } =
          calcAlignLineSegmentOfEdgeToRectAndCursor<IDynamicAlignLine>(
            node.getValidElementOffsetRect(),
            target.getValidElementOffsetRect()
          )
        if (!minDistanceAlignVLine) {
          minDistanceAlignVLine = vertical
          vertical.node = node
        } else if (vertical.distance < minDistanceAlignVLine.distance) {
          minDistanceAlignVLine = vertical
          vertical.node = node
        }

        if (!minDistanceAlignHLine) {
          minDistanceAlignHLine = horizontal
          horizontal.node = node
        } else if (horizontal.distance < minDistanceAlignHLine.distance) {
          minDistanceAlignHLine = horizontal
          horizontal.node = node
        }
      })
    })

    this.updateAlignLine(minDistanceAlignHLine, NODE_SNAP_HORIZONTAL_LINE_TYPE)
    this.updateAlignLine(minDistanceAlignVLine, NODE_SNAP_VERTICAL_LINE_TYPE)
  }

  calcDistanceLineOfTree(nodes: TreeNode[] = []) {}

  calcCustomAlignLine(nodes: TreeNode[] = []) {
    if (!nodes.length) return
    this.customAlignLines.forEach((line) => {
      nodes.forEach((node) => {
        const rect = node.getElementOffsetRect()
        this.updateAlignLine({
          ...line,
          distance: calcDistanceOfEdgeToAlignLineSegment(rect, line),
        })
      })
    })
  }

  findAlignLine(id: string) {
    return this.alignLines.find((item) => item.id === id)
  }

  getAlignVLineFromVertex(node: TreeNode) {
    return this.getAlignLineFromVertex(NODE_SNAP_VERTICAL_LINE_TYPE, node)
  }

  getAlignHLineFromVertex(node: TreeNode) {
    return this.getAlignLineFromVertex(NODE_SNAP_HORIZONTAL_LINE_TYPE, node)
  }

  getAlignLineFromVertex(id: string, node: TreeNode) {
    const parent = node.parent
    const line = this.findAlignLine(id)
    if (line && parent) {
      const selfRef = node.getValidElementOffsetRect()
      const parentRect = parent.getValidElementOffsetRect()
      const edgeOffset = calcOffsetOfAlignLineSegmentToEdge(line, selfRef)
      return {
        ...line,
        start: {
          x: line.start.x - parentRect.x - edgeOffset.x,
          y: line.start.y - parentRect.y - edgeOffset.y,
        },
        end: {
          x: line.end.x - parentRect.x - edgeOffset.x,
          y: line.end.y - parentRect.y - edgeOffset.y,
        },
      }
    }
  }

  isNearAlignLine(id: string) {
    return this.findAlignLine(id)?.distance < SNAP_LINE_BOUNDARY
  }

  updateAlignLine(line: IDynamicAlignLine, id?: string) {
    if (!isAlignLineSegment(line)) return
    line.id = line.id || id
    if (!line.id) return
    const matchedLineIndex = this.alignLines.findIndex(
      (item) => item.id === line.id
    )
    const oldLine = this.alignLines[matchedLineIndex]
    const newLine = cloneAlignLineSegment(line)
    if (matchedLineIndex > -1) {
      newLine.isKissing = isKissingAlignLine(line, oldLine)
      this.alignLines[matchedLineIndex] = newLine
    } else {
      this.alignLines.push(newLine)
    }
  }

  addAlignLine(line: IDynamicAlignLine) {
    if (!isAlignLineSegment(line)) return
    if (!line.id) return
    const matchedLineIndex = this.alignLines.findIndex(
      (item) => item.id === line.id
    )
    if (matchedLineIndex == -1) {
      const newLine = cloneAlignLineSegment(line)
      if (!isValidNumber(newLine.distance)) {
        newLine.distance = Infinity
      }
      this.alignLines.push(newLine)
    }
  }

  removeAlignLine(id: string) {
    const matchedLineIndex = this.alignLines.findIndex((item) => item.id === id)
    if (matchedLineIndex > -1) {
      this.alignLines.splice(matchedLineIndex, 1)
    }
  }

  calcDragLine(nodes: TreeNode[] = []) {
    this.calcCustomAlignLine(nodes)
    this.calcAlignLineOfTree(nodes)
    this.calcDistanceLineOfTree(nodes)
  }

  makeObservable() {
    define(this, {
      alignLines: observable.shallow,
      spaceLines: observable.shallow,
      distanceLines: observable.shallow,
      calcDragLine: action,
      calcCustomAlignLine: action,
      calcAlignLineOfTree: action,
      calcDistanceLineOfTree: action,
    })
  }
}
