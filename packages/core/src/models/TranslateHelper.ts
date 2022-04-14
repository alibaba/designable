import {
  Point,
  IPoint,
  calcEdgeLinesOfRect,
  calcBoundingRect,
  calcSpaceBlockOfRect,
  calcElementTranslate,
  calcDistanceOfSnapLineToEdges,
  IRect,
  isEqualRect,
  isLineSegment,
  ILineSegment,
  calcClosestEdges,
  calcCombineSnapLineSegment,
} from '@designable/shared'
import { observable, define, action } from '@formily/reactive'
import { SpaceBlock, AroundSpaceBlock } from './SpaceBlock'
import { Operation } from './Operation'
import { TreeNode } from './TreeNode'
import { SnapLine, ISnapLine } from './SnapLine'
import { CursorDragType } from './Cursor'

export interface ITranslateHelperProps {
  operation: Operation
}

export class TranslateHelper {
  operation: Operation

  dragNodes: TreeNode[] = []

  rulerSnapLines: SnapLine[] = []

  aroundSnapLines: SnapLine[] = []

  aroundSpaceBlocks: AroundSpaceBlock = null

  dragStartTranslateStore: Record<string, IPoint> = {}

  dragStartTargetRect: IRect = null

  snapping = false

  dragging = true

  requestTimer = null

  constructor(props: ITranslateHelperProps) {
    this.operation = props.operation
    this.makeObservable()
  }

  get tree() {
    return this.operation.tree
  }

  get cursor() {
    return this.operation.engine.cursor
  }

  get cursorPosition() {
    const position = this.cursor.position
    return this.operation.workspace.viewport.getOffsetPoint(
      new Point(position.clientX, position.clientY)
    )
  }

  get cursorDragNodesRect() {
    return new DOMRect(
      this.cursorPosition.x - this.dragStartCursorOffset.x,
      this.cursorPosition.y - this.dragStartCursorOffset.y,
      this.dragNodesRect.width,
      this.dragNodesRect.height
    )
  }

  get cursorDragNodesEdgeLines() {
    return calcEdgeLinesOfRect(this.cursorDragNodesRect)
  }

  get dragNodesRect() {
    return calcBoundingRect(
      this.dragNodes.map((node) => node.getValidElementOffsetRect())
    )
  }

  get dragNodesEdgeLines() {
    return calcEdgeLinesOfRect(this.dragNodesRect)
  }

  get cursorOffset() {
    return new Point(
      this.cursorPosition.x - this.dragNodesRect.x,
      this.cursorPosition.y - this.dragNodesRect.y
    )
  }

  get dragStartCursor() {
    const position = this.operation.engine.cursor.dragStartPosition
    return this.operation.workspace.viewport.getOffsetPoint(
      new Point(position.clientX, position.clientY)
    )
  }

  get dragStartCursorOffset() {
    return new Point(
      this.dragStartCursor.x - this.dragStartTargetRect.x,
      this.dragStartCursor.y - this.dragStartTargetRect.y
    )
  }

  get closestSnapLines() {
    const results: SnapLine[] = []
    const cursorDragNodesEdgeLines = this.cursorDragNodesEdgeLines
    this.thresholdSnapLines.forEach((line) => {
      const distance = calcDistanceOfSnapLineToEdges(
        line,
        cursorDragNodesEdgeLines
      )
      if (distance < TranslateHelper.threshold) {
        const existed = results.findIndex(
          (l) => l.distance > distance && l.direction === line.direction
        )
        if (existed > -1) {
          results.splice(existed, 1)
        }
        results.push(line)
      }
    })
    return results
  }

  get closestSpaceBlocks(): SpaceBlock[] {
    const cursorDragNodesEdgeLines = this.cursorDragNodesEdgeLines
    return this.thresholdSpaceBlocks.filter((block) => {
      const line = block.snapLine
      if (!line) return false
      return (
        calcDistanceOfSnapLineToEdges(line, cursorDragNodesEdgeLines) <
        TranslateHelper.threshold
      )
    })
  }

  get thresholdSnapLines(): SnapLine[] {
    const lines: SnapLine[] = []
    this.aroundSnapLines.forEach((line) => {
      lines.push(line)
    })
    this.rulerSnapLines.forEach((line) => {
      if (line.closest) {
        lines.push(line)
      }
    })
    for (let type in this.aroundSpaceBlocks) {
      const block = this.aroundSpaceBlocks[type]
      const line = block.snapLine
      if (line) {
        lines.push(line)
      }
    }
    return lines
  }

  get thresholdSpaceBlocks(): SpaceBlock[] {
    const results = []
    if (!this.snapping) return []
    for (let type in this.aroundSpaceBlocks) {
      const block = this.aroundSpaceBlocks[type]
      if (block.isometrics.length) {
        results.push(block)
        results.push(...block.isometrics)
      }
    }
    return results
  }

  get measurerSpaceBlocks(): SpaceBlock[] {
    if (!this.snapping) return []
    const results: SpaceBlock[] = []
    for (let type in this.aroundSpaceBlocks) {
      if (this.aroundSpaceBlocks[type])
        results.push(this.aroundSpaceBlocks[type])
    }
    return results
  }

  calcBaseTranslate(node: TreeNode) {
    const deltaX = this.cursor.dragStartToCurrentDelta.clientX
    const deltaY = this.cursor.dragStartToCurrentDelta.clientY
    const dragStartTranslate = this.dragStartTranslateStore[node.id] ?? {
      x: 0,
      y: 0,
    }
    const x = dragStartTranslate.x + deltaX,
      y = dragStartTranslate.y + deltaY
    return { x, y }
  }

  calcRulerSnapLines(dragNodesRect: IRect): SnapLine[] {
    const edgeLines = calcEdgeLinesOfRect(dragNodesRect)
    return this.rulerSnapLines.map((line) => {
      line.distance = calcDistanceOfSnapLineToEdges(line, edgeLines)
      return line
    })
  }

  calcAroundSnapLines(dragNodesRect: IRect): SnapLine[] {
    const results = []
    const edgeLines = calcEdgeLinesOfRect(dragNodesRect)
    this.tree.eachTree((refer) => {
      if (this.dragNodes.includes(refer)) return
      const referRect = refer.getValidElementOffsetRect()
      const referLines = calcEdgeLinesOfRect(referRect)
      const add = (line: ILineSegment) => {
        const [distance, edge] = calcClosestEdges(line, edgeLines)
        const combined = calcCombineSnapLineSegment(line, edge)
        if (distance < TranslateHelper.threshold) {
          results.push(
            new SnapLine(this, {
              ...combined,
              distance,
            })
          )
        }
      }
      referLines.h.forEach(add)
      referLines.v.forEach(add)
    })
    return results
  }

  calcAroundSpaceBlocks(dragNodesRect: IRect): AroundSpaceBlock {
    const closestSpaces = {}
    this.tree.eachTree((refer) => {
      const referRect = refer.getValidElementOffsetRect()

      if (isEqualRect(dragNodesRect, referRect)) return

      const origin = calcSpaceBlockOfRect(dragNodesRect, referRect)

      if (origin) {
        const spaceBlock = new SpaceBlock(this, {
          refer,
          ...origin,
        })
        if (!closestSpaces[origin.type]) {
          closestSpaces[origin.type] = spaceBlock
        } else if (spaceBlock.distance < closestSpaces[origin.type].distance) {
          closestSpaces[origin.type] = spaceBlock
        }
      }
    })
    return closestSpaces as any
  }

  translate(node: TreeNode, handler: (data: IPoint) => void) {
    const translate = this.calcBaseTranslate(node)
    this.snapping = false
    for (let line of this.closestSnapLines) {
      if (line.direction === 'h') {
        translate.y = line.getTranslate(node)
        this.snapping = true
      } else {
        translate.x = line.getTranslate(node)
        this.snapping = true
      }
    }
    handler(translate)
    if (this.snapping) {
      this.dragMove()
    }
  }

  findRulerSnapLine(id: string) {
    return this.rulerSnapLines.find((item) => item.id === id)
  }

  addRulerSnapLine(line: ISnapLine) {
    if (!isLineSegment(line)) return
    if (!this.findRulerSnapLine(line.id)) {
      this.rulerSnapLines.push(new SnapLine(this, { ...line, type: 'ruler' }))
    }
  }

  removeRulerSnapLine(id: string) {
    const matchedLineIndex = this.rulerSnapLines.findIndex(
      (item) => item.id === id
    )
    if (matchedLineIndex > -1) {
      this.rulerSnapLines.splice(matchedLineIndex, 1)
    }
  }

  dragStart(nodes: TreeNode[] = []) {
    this.dragging = true
    this.dragNodes = nodes
    this.dragStartTargetRect = this.dragNodesRect
    this.dragStartTranslateStore = nodes.reduce((buf, node) => {
      buf[node.id] = calcElementTranslate(node.getElement())
      return buf
    }, {})
    this.cursor.setDragType(CursorDragType.Translate)
  }

  dragMove() {
    this.rulerSnapLines = this.calcRulerSnapLines(this.dragNodesRect)
    this.aroundSnapLines = this.calcAroundSnapLines(this.dragNodesRect)
    this.aroundSpaceBlocks = this.calcAroundSpaceBlocks(this.dragNodesRect)
  }

  dragEnd() {
    this.dragging = false
    this.dragStartTranslateStore = {}
    this.aroundSnapLines = []
    this.aroundSpaceBlocks = null
    this.dragStartTargetRect = null
    this.dragNodes = []
    this.cursor.setDragType(CursorDragType.Move)
  }

  makeObservable() {
    define(this, {
      snapping: observable.ref,
      dragNodes: observable.shallow,
      rulerSnapLines: observable.shallow,
      aroundSnapLines: observable.shallow,
      aroundSpaceBlocks: observable.shallow,
      closestSnapLines: observable.computed,
      thresholdSnapLines: observable.computed,
      thresholdSpaceBlocks: observable.computed,
      measurerSpaceBlocks: observable.computed,
      cursor: observable.computed,
      cursorPosition: observable.computed,
      cursorOffset: observable.computed,
      dragStartCursor: observable.computed,
      translate: action,
      dragStart: action,
      dragMove: action,
      dragEnd: action,
    })
  }

  static threshold = 6
}
