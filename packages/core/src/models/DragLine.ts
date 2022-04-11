import {
  isSnapLineSegment,
  Point,
  IPoint,
  calcEdgeLinesOfRect,
  calcCursorEdgeLinesOfRect,
  calcClosestEdgeLines,
  calcDistanceOfLienSegment,
  calcSpaceBlockOfRect,
  calcBoundingRect,
  IRect,
  isEqualRect,
} from '@designable/shared'
import { observable, define, action } from '@formily/reactive'
import { SpaceBlock, ISpaceBlockType } from './SpaceBlock'
import { Operation } from './Operation'
import { TreeNode } from './TreeNode'
import { SnapLine, IDynamicSnapLine } from './SnapLine'
import { CursorDragType } from './Cursor'

const parseElementTranslate = (element: HTMLElement) => {
  const transform = element?.style?.transform
  if (transform) {
    const [x, y] = transform
      .match(
        /translate(?:3d)?\(\s*([-\d.]+)[a-z]+?[\s,]+([-\d.]+)[a-z]+?(?:[\s,]+([-\d.]+))?[a-z]+?\s*\)/
      )
      ?.slice(1, 3) ?? [0, 0]

    return new Point(Number(x), Number(y))
  } else {
    return new Point(Number(element.offsetLeft), Number(element.offsetTop))
  }
}
export interface IDragLineProps {
  operation: Operation
}

export type AroundSpaceBlock = Record<ISpaceBlockType, SpaceBlock>

export class DragLine {
  operation: Operation

  targets: TreeNode[] = []

  rulerSnapLines: SnapLine[] = []

  dynamicSnapLines: SnapLine[] = []

  drawStartTranslateStore: Record<string, IPoint> = {}

  aroundSpaceBlocks: AroundSpaceBlock = null

  drawStartTargetRect: IRect = null

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
    this.rulerSnapLines.forEach((line) => {
      if (line.closest) {
        lines.push(line)
      }
    })
    return lines
  }

  get spaceBlocks(): SpaceBlock[] {
    const results = []
    for (let type in this.aroundSpaceBlocks) {
      const box: SpaceBlock = this.aroundSpaceBlocks[type]
      if (box.isometrics.length) {
        results.push(box)
        results.push(...box.isometrics)
      }
    }
    return results
  }

  get targetRect() {
    return calcBoundingRect(
      this.targets.map((node) => node.getValidElementOffsetRect())
    )
  }

  get cursorOffset() {
    return new Point(
      this.cursor.x - this.targetRect.x,
      this.cursor.y - this.targetRect.y
    )
  }

  get drawStartCursor() {
    const position = this.operation.engine.cursor.dragStartPosition
    return this.operation.workspace.viewport.getOffsetPoint(
      new Point(position.clientX, position.clientY)
    )
  }

  get drawStartCursorOffset() {
    return new Point(
      this.drawStartCursor.x - this.drawStartTargetRect.x,
      this.drawStartCursor.y - this.drawStartTargetRect.y
    )
  }

  calcAroundSpaceBlocks(targetRect: IRect): AroundSpaceBlock {
    const closestSpaces = {}
    this.operation.tree.eachTree((refer) => {
      const referRect = refer.getValidElementOffsetRect()

      if (isEqualRect(targetRect, referRect)) return

      const origin = calcSpaceBlockOfRect(targetRect, referRect)

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

  calcDynamicSnapLines() {
    if (!this.targets.length) return
    this.operation.tree.eachTree((refer) => {
      if (this.targets.includes(refer)) return
      const referRect = refer.getValidElementOffsetRect()
      const targetLines = calcEdgeLinesOfRect(referRect)
      const cursorLines = calcCursorEdgeLinesOfRect(
        this.targetRect,
        this.cursor,
        this.drawStartCursorOffset
      )
      const combineLines = calcClosestEdgeLines(
        targetLines,
        cursorLines,
        DragLine.threshold
      )
      combineLines.h.forEach((line) => {
        this.dynamicSnapLines.push(
          new SnapLine(this, {
            refer,
            ...line,
          })
        )
      })
      combineLines.v.forEach((line) => {
        this.dynamicSnapLines.push(
          new SnapLine(this, {
            refer,
            ...line,
          })
        )
      })
      this.aroundSpaceBlocks = this.calcAroundSpaceBlocks(this.targetRect)
    })
  }

  calcRulerSnapLines() {
    if (!this.targets.length) return
    this.rulerSnapLines.forEach((fixedLine) => {
      const cursorLines = calcCursorEdgeLinesOfRect(
        this.targetRect,
        this.cursor,
        this.drawStartCursorOffset
      )
      if (fixedLine.direction === 'h') {
        const minDistance = Math.min(
          ...cursorLines.h.map((line) =>
            calcDistanceOfLienSegment(line, fixedLine)
          )
        )
        fixedLine.distance = minDistance
      } else {
        const minDistance = Math.min(
          ...cursorLines.v.map((line) =>
            calcDistanceOfLienSegment(line, fixedLine)
          )
        )
        fixedLine.distance = minDistance
      }
    })
  }

  findRulerSnapLine(id: string) {
    return this.rulerSnapLines.find((item) => item.id === id)
  }

  addRulerSnapLine(line: IDynamicSnapLine) {
    if (!isSnapLineSegment(line)) return
    const matchedLineIndex = this.rulerSnapLines.findIndex(
      (item) => item.id === line.id
    )
    if (matchedLineIndex == -1) {
      this.rulerSnapLines.push(new SnapLine(this, line))
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

  drawStart(nodes: TreeNode[] = []) {
    this.targets = nodes
    this.drawStartTargetRect = this.targetRect
    this.drawStartTranslateStore = nodes.reduce((buf, node) => {
      buf[node.id] = parseElementTranslate(node.getElement())
      return buf
    }, {})
    this.operation.engine.cursor.setDragType(CursorDragType.Translate)
  }

  drawing() {
    this.dynamicSnapLines = []
    this.aroundSpaceBlocks = null
    this.calcDynamicSnapLines()
    this.calcRulerSnapLines()
  }

  drawEnd() {
    this.dynamicSnapLines = []
    this.aroundSpaceBlocks = null
    this.drawStartTargetRect = null
    this.targets = []
    this.operation.engine.cursor.setDragType(CursorDragType.Normal)
  }

  getTranslate(node: TreeNode) {
    const cursor = this.operation.engine.cursor
    const deltaX = cursor.dragStartToCurrentDelta.clientX
    const deltaY = cursor.dragStartToCurrentDelta.clientY
    const drawStartTranslate = this.drawStartTranslateStore[node.id] ?? {
      x: 0,
      y: 0,
    }
    const x = drawStartTranslate.x + deltaX,
      y = drawStartTranslate.y + deltaY
    return { x, y }
  }

  getSnapTranslate(node: TreeNode) {
    const translate = this.getTranslate(node)
    for (let line of this.closestSnapLines) {
      if (line.direction === 'h') {
        translate.y = line.getTranslate(node)
      } else {
        translate.x = line.getTranslate(node)
      }
    }
    return translate
  }

  makeObservable() {
    define(this, {
      targets: observable.ref,
      rulerSnapLines: observable.shallow,
      dynamicSnapLines: observable.shallow,
      aroundSpaceBlocks: observable.shallow,
      closestSnapLines: observable.computed,
      spaceBlocks: observable.computed,
      cursor: observable.computed,
      drawStartCursor: observable.computed,
      drawStart: action,
      drawing: action,
      drawEnd: action,
    })
  }

  static threshold = 4
}
