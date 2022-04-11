import {
  isSnapLineSegment,
  Point,
  IPoint,
  calcEdgeLinesOfRect,
  calcCursorEdgeLinesOfRect,
  calcClosestEdgeLines,
  calcDistanceOfLienSegment,
  calcBoundingRect,
  IRect,
} from '@designable/shared'
import { observable, define, action } from '@formily/reactive'
import {
  SpaceBlock,
  AroundSpaceBlock,
  calcAroundSpaceBlocks,
} from './SpaceBlock'
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

const calcTranslate = (dragLine: DragLine, node: TreeNode) => {
  const cursor = dragLine.operation.engine.cursor
  const deltaX = cursor.dragStartToCurrentDelta.clientX
  const deltaY = cursor.dragStartToCurrentDelta.clientY
  const drawStartTranslate = dragLine.drawStartTranslateStore[node.id] ?? {
    x: 0,
    y: 0,
  }
  const x = drawStartTranslate.x + deltaX,
    y = drawStartTranslate.y + deltaY
  return { x, y }
}

const calcDynamicSnapLines = (dragLine: DragLine) => {
  if (!dragLine.targets.length) return
  const tree = dragLine.operation.tree
  tree.eachTree((refer) => {
    if (dragLine.targets.includes(refer)) return
    const referRect = refer.getValidElementOffsetRect()
    const targetLines = calcEdgeLinesOfRect(referRect)
    const cursorLines = calcCursorEdgeLinesOfRect(
      dragLine.targetRect,
      dragLine.cursor,
      dragLine.drawStartCursorOffset
    )
    const combineLines = calcClosestEdgeLines(
      targetLines,
      cursorLines,
      DragLine.threshold
    )
    combineLines.h.forEach((line) => {
      dragLine.dynamicSnapLines.push(
        new SnapLine(this, {
          refer,
          ...line,
        })
      )
    })
    combineLines.v.forEach((line) => {
      dragLine.dynamicSnapLines.push(
        new SnapLine(this, {
          refer,
          ...line,
        })
      )
    })
    dragLine.aroundSpaceBlocks = calcAroundSpaceBlocks(
      tree,
      dragLine.targetRect
    )
  })
}

const calcRulerSnapLines = (dragLine: DragLine) => {
  if (!dragLine.targets.length) return
  dragLine.rulerSnapLines.forEach((fixedLine) => {
    const cursorLines = calcCursorEdgeLinesOfRect(
      dragLine.targetRect,
      dragLine.cursor,
      dragLine.drawStartCursorOffset
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
export interface IDragLineProps {
  operation: Operation
}

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

  calcSnapTranslate(node: TreeNode) {
    const translate = calcTranslate(this, node)
    for (let line of this.closestSnapLines) {
      if (line.direction === 'h') {
        translate.y = line.getTranslate(node)
      } else {
        translate.x = line.getTranslate(node)
      }
    }
    return translate
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
    calcDynamicSnapLines(this)
    calcRulerSnapLines(this)
  }

  drawEnd() {
    this.dynamicSnapLines = []
    this.aroundSpaceBlocks = null
    this.drawStartTargetRect = null
    this.targets = []
    this.operation.engine.cursor.setDragType(CursorDragType.Normal)
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
