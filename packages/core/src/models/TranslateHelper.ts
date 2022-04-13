import {
  isSnapLineSegment,
  Point,
  IPoint,
  calcEdgeLinesOfRect,
  calcCursorEdgeLinesOfRect,
  calcClosestEdgeLines,
  calcDistanceOfLienSegment,
  calcBoundingRect,
  calcSpaceBlockOfRect,
  IRect,
  isEqualRect,
} from '@designable/shared'
import { observable, define, action } from '@formily/reactive'
import { SpaceBlock, AroundSpaceBlock } from './SpaceBlock'
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

const calcTranslate = (translateHelper: TranslateHelper, node: TreeNode) => {
  const cursor = translateHelper.operation.engine.cursor
  const deltaX = cursor.dragStartToCurrentDelta.clientX
  const deltaY = cursor.dragStartToCurrentDelta.clientY
  const dragStartTranslate = translateHelper.dragStartTranslateStore[
    node.id
  ] ?? {
    x: 0,
    y: 0,
  }
  const x = dragStartTranslate.x + deltaX,
    y = dragStartTranslate.y + deltaY
  return { x, y }
}

const calcDynamicSnapLines = (translateHelper: TranslateHelper) => {
  if (!translateHelper.dragNodes.length) return
  const tree = translateHelper.operation.tree
  tree.eachTree((refer) => {
    if (translateHelper.dragNodes.includes(refer)) return
    const referRect = refer.getValidElementOffsetRect()
    const targetLines = calcEdgeLinesOfRect(referRect)
    const cursorLines = calcCursorEdgeLinesOfRect(
      translateHelper.dragNodesRect,
      translateHelper.cursor,
      translateHelper.dragStartCursorOffset
    )
    const closestLines = calcClosestEdgeLines(
      targetLines,
      cursorLines,
      TranslateHelper.threshold
    )
    const dynamicSnapLines = translateHelper.dynamicSnapLines
    closestLines.h.forEach((line) => {
      const gtLineIndex = dynamicSnapLines.findIndex(
        (l) => l.direction === 'h' && l.distance != line.distance
      )
      if (gtLineIndex > -1) {
        dynamicSnapLines.splice(gtLineIndex, 1)
      }
      dynamicSnapLines.push(
        new SnapLine(translateHelper, {
          refer,
          ...line,
        })
      )
    })
    closestLines.v.forEach((line) => {
      const gtLineIndex = dynamicSnapLines.findIndex(
        (l) => l.direction === 'v' && l.distance != line.distance
      )
      if (gtLineIndex > -1) {
        dynamicSnapLines.splice(gtLineIndex, 1)
      }
      dynamicSnapLines.push(
        new SnapLine(translateHelper, {
          refer,
          ...line,
        })
      )
    })
    translateHelper.aroundSpaceBlocks = translateHelper.calcAroundSpaceBlocks(
      translateHelper.dragNodesRect
    )
  })
}

const calcRulerSnapLines = (translateHelper: TranslateHelper) => {
  if (!translateHelper.dragNodes.length) return
  translateHelper.rulerSnapLines.forEach((fixedLine) => {
    const cursorLines = calcCursorEdgeLinesOfRect(
      translateHelper.dragNodesRect,
      translateHelper.cursor,
      translateHelper.dragStartCursorOffset
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

const calcRulerSpaceBlocks = (translateHelper: TranslateHelper) => {
  const results: SpaceBlock[] = []
  for (let type in translateHelper.aroundSpaceBlocks) {
    if (translateHelper.aroundSpaceBlocks[type])
      results.push(translateHelper.aroundSpaceBlocks[type])
  }
  return results
}
export interface ITranslateHelperProps {
  operation: Operation
}

export class TranslateHelper {
  operation: Operation

  dragNodes: TreeNode[] = []

  rulerSnapLines: SnapLine[] = []

  dynamicSnapLines: SnapLine[] = []

  rulerSpaceBlocks: SpaceBlock[] = []

  dragStartTranslateStore: Record<string, IPoint> = {}

  aroundSpaceBlocks: AroundSpaceBlock = null

  dragStartTargetRect: IRect = null

  constructor(props: ITranslateHelperProps) {
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

  get dragNodesRect() {
    return calcBoundingRect(
      this.dragNodes.map((node) => node.getValidElementOffsetRect())
    )
  }

  get cursorOffset() {
    return new Point(
      this.cursor.x - this.dragNodesRect.x,
      this.cursor.y - this.dragNodesRect.y
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

  calcAroundSpaceBlocks(dragNodesRect: IRect): AroundSpaceBlock {
    const closestSpaces = {}
    this.operation.tree.eachTree((refer) => {
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
    const translate = calcTranslate(this, node)
    let snapping = false
    for (let line of this.closestSnapLines) {
      if (line.direction === 'h') {
        translate.y = line.getTranslate(node)
        snapping = true
      } else {
        translate.x = line.getTranslate(node)
        snapping = true
      }
    }
    handler(translate)
    if (snapping) {
      calcDynamicSnapLines(this)
      calcRulerSnapLines(this)
      this.rulerSpaceBlocks = calcRulerSpaceBlocks(this)
    } else {
      this.rulerSpaceBlocks = []
    }
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

  dragStart(nodes: TreeNode[] = []) {
    this.dragNodes = nodes
    this.dragStartTargetRect = this.dragNodesRect
    this.dragStartTranslateStore = nodes.reduce((buf, node) => {
      buf[node.id] = parseElementTranslate(node.getElement())
      return buf
    }, {})
    this.operation.engine.cursor.setDragType(CursorDragType.Translate)
  }

  dragging() {
    this.dynamicSnapLines = []
    this.aroundSpaceBlocks = null
    calcDynamicSnapLines(this)
    calcRulerSnapLines(this)
  }

  dragEnd() {
    this.dynamicSnapLines = []
    this.aroundSpaceBlocks = null
    this.dragStartTargetRect = null
    this.dragNodes = []
    this.operation.engine.cursor.setDragType(CursorDragType.Move)
  }

  makeObservable() {
    define(this, {
      dragNodes: observable.shallow,
      rulerSnapLines: observable.shallow,
      dynamicSnapLines: observable.shallow,
      aroundSpaceBlocks: observable.shallow,
      closestSnapLines: observable.computed,
      rulerSpaceBlocks: observable.shallow,
      spaceBlocks: observable.computed,
      cursor: observable.computed,
      dragStartCursor: observable.computed,
      dragStart: action,
      dragging: action,
      dragEnd: action,
    })
  }

  static threshold = 6
}
