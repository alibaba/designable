import {
  Point,
  calcEdgeLinesOfRect,
  calcSpaceBlockOfRect,
  calcDistanceOfSnapLineToEdges,
  IRect,
  Rect,
  isEqualRect,
  isLineSegment,
  ILineSegment,
  calcClosestEdges,
  calcCombineSnapLineSegment,
  ElementBox,
  ElementGroupBox,
  createElementBox,
  PointTypes,
  Vector,
  LineSegment,
  calcProjectionOfVector,
  Position,
  MatrixRect,
} from '@designable/shared'
import { observable, define, action } from '@formily/reactive'
import { SpaceBlock, AroundSpaceBlock } from './SpaceBlock'
import { Operation } from './Operation'
import { TreeNode } from './TreeNode'
import { SnapLine, ISnapLine } from './SnapLine'
import { CursorDragType } from './Cursor'

export interface ITransformHelperProps {
  operation: Operation
}

export type TransformHelperType = 'translate' | 'resize' | 'rotate' | 'round'

export type ResizeDirection =
  | 'left-top'
  | 'left-center'
  | 'left-bottom'
  | 'center-top'
  | 'center-bottom'
  | 'right-top'
  | 'right-bottom'
  | 'right-center'
  | (string & {})

export type ResizeCalcDirection = [number, number, PointTypes]

export interface ITransformHelperDragStartProps {
  type: TransformHelperType
  direction?: ResizeDirection
  dragNodes: TreeNode[]
}

export class TransformHelper {
  operation: Operation

  type: TransformHelperType

  direction: ResizeCalcDirection = [0, 0, 'cc']

  dragNodes: TreeNode[] = []

  rulerSnapLines: SnapLine[] = []

  closestSnapLines: SnapLine[] = []

  axisSpaceBlocks: SpaceBlock[] = []

  aroundSpaceBlocks: AroundSpaceBlock = null

  viewportRectsStore: Record<string, Rect> = {}

  dragNodesBox: ElementGroupBox<TreeNode> | ElementBox<TreeNode> = null

  dragNodesRect: MatrixRect = null

  dragNodesShadowBox: ElementGroupBox<TreeNode> | ElementBox<TreeNode> = null

  dragNodesShadowRect: MatrixRect = null

  dragStartFixedPosition: Position = null

  dragStartControlPosition: Position = null

  dragStartMatrixRect: MatrixRect = null

  dragStartRotation = 0

  dragMaxOffsetX = 0

  dragMaxOffsetY = 0

  snapping = false

  dragging = false

  snapped = false

  optionMode = 0

  commandMode = 0

  lockMode = 0

  constructor(props: ITransformHelperProps) {
    this.operation = props.operation
    this.makeObservable()
  }

  get tree() {
    return this.operation.tree
  }

  get cursor() {
    return this.operation.engine.cursor
  }

  get viewport() {
    return this.operation.workspace.viewport
  }

  get deltaX() {
    return this.cursor.dragStartToCurrentDelta.clientX
  }

  get deltaY() {
    return this.cursor.dragStartToCurrentDelta.clientY
  }

  get dragNodesOffsetRect() {
    const clientRect = this.dragNodesRect?.boundingClientRect
    if (clientRect) {
      return this.viewport.getOffsetRect(clientRect)
    }
  }

  get dragNodesShadowOffsetRect() {
    const clientRect = this.dragNodesShadowRect?.boundingClientRect
    if (clientRect) {
      return this.viewport.getOffsetRect(clientRect)
    }
  }

  get dragNodesShadowEdgeLines() {
    return calcEdgeLinesOfRect(this.dragNodesShadowOffsetRect)
  }

  get dragNodesEdgeLines() {
    return calcEdgeLinesOfRect(this.dragNodesOffsetRect)
  }

  get dragStartCursor() {
    const position = this.operation.engine.cursor.dragStartPosition
    return this.operation.workspace.viewport.getOffsetPoint(
      new Point(position.clientX, position.clientY)
    )
  }

  get thresholdSnapLines() {
    if (!this.dragging) return []
    const results: SnapLine[] = []
    const dragNodesShadowEdgeLines = this.dragNodesShadowEdgeLines
    this.closestSnapLines.forEach((line) => {
      const distance = calcDistanceOfSnapLineToEdges(
        line,
        dragNodesShadowEdgeLines
      )
      if (distance < TransformHelper.threshold) {
        const existed = results.findIndex(
          (l) =>
            l.distance > distance &&
            l.distance > 0 &&
            l.direction === line.direction
        )
        if (existed > -1) {
          results.splice(existed, 1)
        }
        results.push(line)
      }
    })
    return results
  }

  get thresholdSpaceBlocks(): SpaceBlock[] {
    if (!this.dragging) return []
    const dragNodesShadowEdgeLines = this.dragNodesShadowEdgeLines
    return this.axisSpaceBlocks.filter((block) => {
      const line = block.snapLine
      if (!line) return false
      return (
        calcDistanceOfSnapLineToEdges(line, dragNodesShadowEdgeLines) <
        TransformHelper.threshold
      )
    })
  }

  get measurerSpaceBlocks(): SpaceBlock[] {
    const results: SpaceBlock[] = []
    if (!this.dragging || !this.snapped) return []
    for (let type in this.aroundSpaceBlocks) {
      if (this.aroundSpaceBlocks[type])
        results.push(this.aroundSpaceBlocks[type])
    }
    return results
  }

  calcResizeFixedPosition() {
    const [, , type] = this.direction
    const points = this.dragNodesShadowBox.points
    if (this.optionMode) return points.cc
    switch (type) {
      case 'cb':
        return points.ct
      case 'ct':
        return points.cb
      case 'lt':
        return points.rb
      case 'lc':
        return points.rc
      case 'lb':
        return points.rt
      case 'rt':
        return points.lb
      case 'rb':
        return points.lt
      case 'rc':
        return points.lc
    }
  }

  calcResizeControlPosition() {
    const [, , type] = this.direction
    const points = this.dragNodesShadowBox.points
    return points[type]
  }

  calcResizeDirection(direction: ResizeDirection): ResizeCalcDirection {
    switch (direction) {
      case 'center-bottom':
        return [0, -1, 'cb']
      case 'center-top':
        return [0, 1, 'ct']
      case 'left-bottom':
        return [1, -1, 'lb']
      case 'left-center':
        return [1, 0, 'lc']
      case 'left-top':
        return [1, 1, 'lt']
      case 'right-bottom':
        return [-1, -1, 'rb']
      case 'right-top':
        return [-1, 1, 'rt']
      case 'right-center':
        return [-1, 0, 'rc']
    }
  }

  calcDragStartStore(nodes: TreeNode[] = []) {
    this.dragMaxOffsetX = 0
    this.dragMaxOffsetY = 0
    this.dragNodesBox = createElementBox(nodes)
    this.dragNodesShadowBox = createElementBox(nodes)
    this.dragNodesShadowRect = this.dragNodesBox.matrixRect
    this.dragNodesRect = this.dragNodesBox.matrixRect
    this.dragStartMatrixRect = this.dragNodesBox.matrixRect
    this.dragStartFixedPosition = this.calcResizeFixedPosition()
    this.dragStartControlPosition = this.calcResizeControlPosition()
    this.dragStartRotation = this.dragNodesBox.rotation
  }

  calcRulerSnapLines(dragNodesRect: IRect): SnapLine[] {
    const edgeLines = calcEdgeLinesOfRect(dragNodesRect)
    return this.rulerSnapLines.map((line) => {
      line.distance = calcDistanceOfSnapLineToEdges(line, edgeLines)
      return line
    })
  }

  calcClosestSnapLines(dragNodesRect: Rect): SnapLine[] {
    if (!this.dragging || !dragNodesRect) return []
    const edgeLines = calcEdgeLinesOfRect(dragNodesRect)
    const snapLines = {}
    const addSnapLine = (snapLine: SnapLine) => {
      const edge = snapLine.getClosestEdge(dragNodesRect)
      snapLines[edge] = snapLines[edge] || snapLine
      if (snapLines[edge].distance > snapLine.distance) {
        snapLines[edge] = snapLine
      }
    }

    this.eachViewportNodes((refer, referRect) => {
      if (this.dragNodes.includes(refer)) return
      const referLines = calcEdgeLinesOfRect(referRect)
      const addAroundSnapLine = (line: ILineSegment) => {
        const [distance, edge] = calcClosestEdges(line, edgeLines)
        if (!edge) return
        const combined = calcCombineSnapLineSegment(line, edge)
        if (distance < TransformHelper.threshold) {
          addSnapLine(
            new SnapLine(this, {
              ...combined,
              distance,
            })
          )
        }
      }
      referLines.h.forEach(addAroundSnapLine)
      referLines.v.forEach(addAroundSnapLine)
    })

    this.rulerSnapLines.forEach((line) => {
      if (line.closest) {
        addSnapLine(line)
      }
    })
    for (let type in this.aroundSpaceBlocks) {
      const block = this.aroundSpaceBlocks[type]
      const line = block.snapLine
      if (line) {
        addSnapLine(line)
      }
    }
    return Object.values(snapLines)
  }

  calcAroundSpaceBlocks(dragNodesRect: IRect): AroundSpaceBlock {
    if (!dragNodesRect) return {} as any
    const aroundSpaces = {}
    this.eachViewportNodes((refer, referRect) => {
      if (isEqualRect(dragNodesRect, referRect)) return
      const origin = calcSpaceBlockOfRect(dragNodesRect, referRect)
      if (origin) {
        const spaceBlock = new SpaceBlock(this, {
          refer,
          ...origin,
        })
        if (!aroundSpaces[origin.type]) {
          aroundSpaces[origin.type] = spaceBlock
        } else if (spaceBlock.distance < aroundSpaces[origin.type].distance) {
          aroundSpaces[origin.type] = spaceBlock
        }
      }
    })
    return aroundSpaces as any
  }

  calcAxisSpaceBlocks(aroundSpaceBlocks: AroundSpaceBlock): SpaceBlock[] {
    const results = []
    if (!this.dragging) return []
    for (let type in aroundSpaceBlocks) {
      const block = aroundSpaceBlocks[type]
      if (!block.snapLine) return []
      if (block.snapLine.distance !== 0) return []
      if (block.isometrics.length) {
        results.push(block)
        results.push(...block.isometrics)
      }
    }
    return results
  }

  calcViewportNodes() {
    this.tree.eachTree((node) => {
      const clientRect = node.getValidElementClientRect()
      const offsetRect = node.getValidElementOffsetRect()
      if (this.dragNodes.includes(node)) return
      if (this.viewport.isRectIntersectionInViewport(clientRect)) {
        this.viewportRectsStore[node.id] = offsetRect
      }
    })
  }

  getNodeRect(node: TreeNode) {
    return this.viewportRectsStore[node.id]
  }

  eachViewportNodes(visitor: (node: TreeNode, rect: Rect) => void) {
    for (let id in this.viewportRectsStore) {
      visitor(this.tree.findById(id), this.viewportRectsStore[id])
    }
  }

  calcShadowTransform() {
    const startRect = this.dragStartMatrixRect
    const startWidth = startRect.width
    const startHeight = startRect.height
    const dragNodesBox = this.dragNodesShadowBox
    if (this.type === 'translate') {
      if (this.lockMode) {
        this.dragMaxOffsetX = Math.max(
          Math.abs(this.deltaX),
          this.dragMaxOffsetX
        )
        this.dragMaxOffsetY = Math.max(
          Math.abs(this.deltaY),
          this.dragMaxOffsetY
        )
        if (Math.abs(this.dragMaxOffsetX) > Math.abs(this.dragMaxOffsetY)) {
          return [this.deltaX, 0]
        } else {
          return [0, this.deltaY]
        }
      }
      return [this.deltaX, this.deltaY]
    }
    if (this.type === 'resize') {
      const [a, b, cur] = this.direction
      const control = dragNodesBox.points[cur]
      const startFixed = this.dragStartFixedPosition
      const startControl = this.dragStartControlPosition
      const fixedRatioX = startFixed.x / startWidth
      const fixedRatioY = startFixed.y / startHeight
      const trackRatioX = Math.abs(startControl.x - startFixed.x) / startWidth
      const trackRatioY = Math.abs(startControl.y - startFixed.y) / startHeight
      const deltaX =
        1 - trackRatioX ? this.deltaX / (1 - trackRatioX) : this.deltaX
      const deltaY =
        1 - trackRatioY ? this.deltaY / (1 - trackRatioY) : this.deltaY
      const cursorVector = new Point(deltaX, deltaY)
      const trackVector = new Vector(new LineSegment(startFixed, control))
      const trackProjection = calcProjectionOfVector(cursorVector, trackVector)
      const calcFixedOffset = (distWidth: number, distHeight: number) => {
        return {
          x: fixedRatioX * startWidth - fixedRatioX * distWidth,
          y: fixedRatioY * startHeight - fixedRatioY * distHeight,
        }
      }
      if (this.lockMode) {
        const ratio = startWidth / startHeight
        const xVector = new Point(startWidth, 0)
        const yVector = new Point(0, startHeight)
        const xProjection = calcProjectionOfVector(trackProjection, xVector)
        const yProjection = calcProjectionOfVector(trackProjection, yVector)
        const pDeltaX = xProjection.x
        const pDeltaY = yProjection.y
        if (Math.abs(pDeltaX) > Math.abs(pDeltaY)) {
          const distWidth = Math.max(startWidth - pDeltaX * a, 0)
          const distHeight = distWidth / ratio
          return [distWidth, distHeight, calcFixedOffset(distWidth, distHeight)]
        } else {
          const distHeight = Math.max(startHeight - pDeltaY * b, 0)
          const distWidth = distHeight * ratio
          return [distWidth, distHeight, calcFixedOffset(distWidth, distHeight)]
        }
      }
      const distWidth = Math.max(startWidth - deltaX * a, 0)
      const distHeight = Math.max(startHeight - deltaY * b, 0)
      return [distWidth, distHeight, calcFixedOffset(distWidth, distHeight)]
    }
    if (this.type === 'rotate') {
      const cursor = this.cursor.position
      const origin = dragNodesBox.transformOrigin
      const angle =
        Math.atan2(
          cursor.topClientY - origin.clientY,
          cursor.topClientX - origin.clientX
        ) +
        Math.PI / 2
      if (this.lockMode) {
        const degree = ((this.dragStartRotation + angle) * 180) / Math.PI
        const targetDegree = Math.round(degree / 15) * 15
        return [(targetDegree * Math.PI) / 180 - this.dragStartRotation]
      }
      return [angle]
    }
    return []
  }

  calcSnapTransform() {
    const shadow = this.calcShadowTransform()
    return shadow
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

  dragStart(props: ITransformHelperDragStartProps) {
    const dragNodes = props?.dragNodes
    const type = props?.type
    const direction = props?.direction
    if (type === 'resize') {
      const nodes = TreeNode.filterResizable(dragNodes)
      if (nodes.length) {
        this.dragging = true
        this.type = type
        this.direction = this.calcResizeDirection(direction)
        this.dragNodes = nodes
        this.calcDragStartStore(nodes)
        this.cursor.setDragType(CursorDragType.Resize)
      }
    } else if (type === 'translate') {
      const nodes = TreeNode.filterTranslatable(dragNodes)
      if (nodes.length) {
        this.dragging = true
        this.type = type
        this.dragNodes = nodes
        this.calcDragStartStore(nodes)
        this.cursor.setDragType(CursorDragType.Translate)
      }
    } else if (type === 'rotate') {
      const nodes = TreeNode.filterRotatable(dragNodes)
      if (nodes.length) {
        this.dragging = true
        this.type = type
        this.dragNodes = nodes
        this.calcDragStartStore(nodes)
        this.cursor.setDragType(CursorDragType.Rotate)
      }
    } else if (type === 'round') {
      const nodes = TreeNode.filterRoundable(dragNodes)
      if (nodes.length) {
        this.dragging = true
        this.type = type
        this.dragNodes = nodes
        this.calcDragStartStore(nodes)
        this.cursor.setDragType(CursorDragType.Round)
      }
    }
    if (this.dragging) {
      this.calcViewportNodes()
    }
  }

  dragMove() {
    if (!this.dragging) return
    const shadowRect = this.dragNodesOffsetRect
    this.rulerSnapLines = this.calcRulerSnapLines(shadowRect)
    this.aroundSpaceBlocks = this.calcAroundSpaceBlocks(shadowRect)
    this.axisSpaceBlocks = this.calcAxisSpaceBlocks(this.aroundSpaceBlocks)
    this.closestSnapLines = this.calcClosestSnapLines(shadowRect)
    this.dragNodesShadowBox.transform((t) => {
      if (t[this.type]) {
        t[this.type](...this.calcShadowTransform())
      }
    })
    this.dragNodesBox.transform((t) => {
      if (t[this.type]) {
        t[this.type](...this.calcSnapTransform())
      }
    })()
    this.dragNodesRect = this.dragNodesBox.matrixRect
    this.dragNodesShadowRect = this.dragNodesShadowBox.matrixRect
  }

  startOptionMode() {
    this.optionMode = 1
  }

  startCommandMode() {
    this.commandMode = 1
  }

  cancelOptionMode() {
    this.optionMode = 0
  }

  startLockMode() {
    this.lockMode = 1
  }

  cancelLockMode() {
    this.lockMode = 0
  }

  cancelCommandMode() {
    this.commandMode = 0
  }

  dragEnd() {
    this.dragging = false
    this.viewportRectsStore = {}
    this.dragNodesBox = null
    this.closestSnapLines = []
    this.axisSpaceBlocks = []
    this.aroundSpaceBlocks = null
    this.dragMaxOffsetX = 0
    this.dragMaxOffsetY = 0
    this.dragNodesBox = null
    this.dragNodesShadowBox = null
    this.dragNodesShadowRect = null
    this.dragNodesRect = null
    this.dragStartMatrixRect = null
    this.dragStartFixedPosition = null
    this.dragStartControlPosition = null
    this.dragNodes = []
    this.cursor.setDragType(CursorDragType.Move)
  }

  makeObservable() {
    define(this, {
      optionMode: observable.ref,
      lockMode: observable.ref,
      snapped: observable.ref,
      dragging: observable.ref,
      snapping: observable.ref,
      dragNodes: observable.ref,
      closestSnapLines: observable.ref,
      axisSpaceBlocks: observable.ref,
      aroundSpaceBlocks: observable.ref,
      dragNodesRect: observable.ref,
      dragNodesShadowRect: observable.ref,
      rulerSnapLines: observable.shallow,
      thresholdSnapLines: observable.computed,
      thresholdSpaceBlocks: observable.computed,
      measurerSpaceBlocks: observable.computed,
      cursor: observable.computed,
      dragNodesEdgeLines: observable.computed,
      dragStartCursor: observable.computed,
      startOptionMode: action,
      startLockMode: action,
      cancelOptionMode: action,
      cancelLockMode: action,
      dragStart: action,
      dragMove: action,
      dragEnd: action,
    })
  }

  static threshold = 6
}
