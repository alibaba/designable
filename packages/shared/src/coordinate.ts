import {
  identity,
  inverse,
  decomposeTSR,
  compose,
  scale,
  rotate,
  translate,
  Matrix,
  rotateDEG,
  applyToPoint,
  Transform,
} from 'transformation-matrix'
import parseUnit from 'parse-unit'
import {
  Point,
  IPoint,
  Rect,
  calcCenterPoint,
  calcDistanceOfPoints,
} from './geometry'

export interface ICoordinateSystem {
  absoluteMatrix: Matrix
  transformMatrix: Matrix
  clientMatrix: Matrix
  transformOrigin: Position
  width: number
  height: number
}

export interface BoxSize {
  width: number
  height: number
}

export interface ITransformer {
  push: (matrix: Matrix) => void
  resize: (width: number, height: number, offset: IPoint) => void
  translate: (tx: number, ty?: number) => void
  scale: (sx: number, sy?: number, origin?: IPoint) => void
  rotate: (rotation: number, origin?: IPoint) => void
  rotateDEG: (angle: number, origin?: IPoint) => void
}

export interface IElementNode {
  getElement(): HTMLElement
}

export type VertexTypes = 'lt' | 'rt' | 'rb' | 'lb' | (string & {})

export type CenterTypes = 'lc' | 'rc' | 'cc' | 'ct' | 'cb' | (string & {})

export type PointTypes = VertexTypes | CenterTypes

const PIXELS_PER_INCH = 96

const defaultUnits: Record<string, number> = {
  ch: 8,
  ex: 7.15625,
  em: 16,
  rem: 16,
  in: PIXELS_PER_INCH,
  cm: PIXELS_PER_INCH / 2.54,
  mm: PIXELS_PER_INCH / 25.4,
  pt: PIXELS_PER_INCH / 72,
  pc: PIXELS_PER_INCH / 6,
  px: 1,
}

function isIframeElement(element: HTMLElement) {
  return element?.ownerDocument?.defaultView?.parent !== window
}

function createScrollOffsetGetter(element: HTMLElement) {
  const parents = []
  let current = element,
    parent = current
  while (true) {
    current = parent
    parent = parent.parentElement
    if (parent) {
      if (parent.scrollHeight > parent.clientHeight) {
        parents.push(parent)
        continue
      }
    }
    if (isIframeElement(current)) {
      const defaultView = current.ownerDocument.defaultView
      const frameElement = defaultView?.frameElement as HTMLElement
      if (frameElement) {
        parents.push(defaultView)
        continue
      }
    }
    break
  }

  parents.push(window)

  return () => {
    let x = 0,
      y = 0
    for (let i = 0; i < parents.length; i++) {
      const node = parents[i]
      x += node.scrollLeft ?? node.scrollX
      y += node.scrollTop ?? node.scrollY
    }
    return new Point(x, y)
  }
}

function moveToStandardOrigin(
  transformMatrix: Matrix,
  transformOrigin: Position
) {
  return compose(
    translate(transformOrigin.x, transformOrigin.y),
    transformMatrix,
    translate(-transformOrigin.x, -transformOrigin.y)
  )
}

function moveToCSSOrigin(transformMatrix: Matrix, transformOrigin: Position) {
  return compose(
    translate(-transformOrigin.x, -transformOrigin.y),
    transformMatrix,
    translate(transformOrigin.x, transformOrigin.y)
  )
}

export class ElementCoord implements ICoordinateSystem {
  element: HTMLElement
  parentAbsoluteMatrix: Matrix
  transformMatrix: Matrix
  transformOrigin: Position
  transformOriginStyle: string
  scrollOffset: Point
  matrix: Matrix
  width: number
  height: number
  constructor(element?: HTMLElement) {
    this.element = element
    this.width = element?.offsetWidth ?? Infinity
    this.height = element?.offsetHeight ?? Infinity
    this.transformOriginStyle = element?.style?.transformOrigin
    this.transformOrigin = this.calcTransformOrigin(
      this.transformOriginStyle,
      this.width,
      this.height
    )
    this.parentAbsoluteMatrix = this.calcElementAbsoluteMatrix(
      element?.parentElement
    )
    this.transformMatrix = moveToStandardOrigin(
      this.calcElementTransformMatrix(element),
      this.transformOrigin
    )
    this.matrix = this.transformMatrix
    Object.defineProperty(this, 'scrollOffset', {
      get: createScrollOffsetGetter(element),
    })
  }

  get origin() {
    return new Position(this, { x: 0, y: 0 })
  }

  get clientMatrix() {
    const offset = this.scrollOffset
    const elementOffsetX = this.element?.offsetLeft ?? 0
    const elementOffsetY = this.element?.offsetTop ?? 0
    return compose(
      this.parentAbsoluteMatrix,
      translate(elementOffsetX - offset.x, elementOffsetY - offset.y),
      this.matrix
    )
  }

  get absoluteMatrix() {
    const elementOffsetX = this.element?.offsetLeft ?? 0
    const elementOffsetY = this.element?.offsetTop ?? 0
    return compose(
      this.parentAbsoluteMatrix,
      translate(elementOffsetX, elementOffsetY),
      this.matrix
    )
  }

  get cssMatrix() {
    return moveToCSSOrigin(this.matrix, this.transformOrigin)
  }

  calcElementTransformOrigin(element: HTMLElement) {
    return this.calcTransformOrigin(
      element?.style?.transformOrigin,
      element?.offsetWidth,
      element?.offsetHeight
    )
  }

  calcTransformOrigin(
    transformOriginStyle: string,
    width: number,
    height: number
  ) {
    const transformOrigin = transformOriginStyle || 'center'
    const origin = transformOrigin.trim()
    if (!origin) return new Position(this, { x: 0, y: 0 })
    const splits = origin.split(/\s+/)
    const x = width / 2,
      y = height / 2
    const toPx = (value: string, axis: 'x' | 'y') => {
      const defaultValue = axis === 'x' ? x : y
      if (!value) return defaultValue
      const parts = parseUnit(value)
      if (!isNaN(parts[0])) {
        if (parts[1]) {
          if (parts[1] === '%') {
            return axis === 'x'
              ? width * 0.001 * parts[0]
              : height * 0.001 * parts[0]
          }
          const px = defaultUnits[parts[1]]
          return typeof px === 'number' ? parts[0] * px : defaultValue
        } else {
          return parts[0]
        }
      }
      return defaultValue
    }
    const createPosition = (x: number, y: number) => {
      return new Position(this, { x, y })
    }
    if (splits.length === 1) {
      switch (splits[0]) {
        case 'bottom':
          return createPosition(x, height)
        case 'absolute':
          return createPosition(x, 0)
        case 'left':
          return createPosition(0, y)
        case 'right':
          return createPosition(width, y)
      }
    } else if (splits.length > 1) {
      if (splits[0] === 'bottom') {
        if (splits[1] === 'left') {
          return createPosition(0, height)
        }
        if (splits[1] === 'right') {
          return createPosition(width, height)
        }
        return createPosition(x, y)
      }
      if (splits[0] === 'absolute') {
        if (splits[1] === 'left') {
          return createPosition(0, 0)
        }
        if (splits[1] === 'right') {
          return createPosition(width, 0)
        }
        return createPosition(x, y)
      }
      if (splits[0] === 'left') {
        if (splits[1] === 'absolute') {
          return createPosition(0, 0)
        }
        if (splits[1] === 'bottom') {
          return createPosition(0, height)
        }
        return createPosition(0, toPx(splits[1], 'y'))
      }
      if (splits[0] === 'right') {
        if (splits[1] === 'absolute') {
          return createPosition(width, 0)
        }
        if (splits[1] === 'bottom') {
          return createPosition(width, height)
        }
        return createPosition(width, toPx(splits[1], 'y'))
      }
      return createPosition(toPx(splits[0], 'x'), toPx(splits[1], 'y'))
    }
    return createPosition(x, y)
  }

  calcElementTransformMatrix(element: HTMLElement) {
    if (!element) return identity()
    const transform = getComputedStyle(element).transform
    if (!transform || transform === 'none') return identity()
    const parsed = transform
      .match(/matrix?\(([^)]+)\)/)?.[1]
      ?.split(',')
      .map(parseFloat)
    if (parsed && parsed.length === 6)
      return {
        a: parsed[0],
        b: parsed[1],
        c: parsed[2],
        d: parsed[3],
        e: parsed[4],
        f: parsed[5],
      }
    return identity()
  }

  calcElementAbsoluteMatrix(
    element: HTMLElement,
    transformMatrix: Matrix = this.calcElementTransformMatrix(element),
    transformOrigin: Position = this.calcElementTransformOrigin(element)
  ): Matrix {
    if (!element) return identity()
    const parent = element.offsetParent as HTMLElement
    const matrix = moveToStandardOrigin(transformMatrix, transformOrigin)
    if (parent) {
      const offsetLeft = element.offsetLeft
      const offsetTop = element.offsetTop
      return compose(
        this.calcElementAbsoluteMatrix(parent),
        translate(offsetLeft, offsetTop),
        matrix
      )
    }
    if (isIframeElement(element)) {
      const frameElement = element.ownerDocument.defaultView
        ?.frameElement as HTMLElement
      if (frameElement) {
        const offsetLeft = frameElement.offsetLeft
        const offsetTop = frameElement.offsetTop
        return compose(
          this.calcElementAbsoluteMatrix(
            frameElement.offsetParent as HTMLElement
          ),
          translate(offsetLeft, offsetTop),
          matrix
        )
      }
    }
    return matrix
  }

  transform(transformer: (transformer: ITransformer) => void) {
    if (typeof transformer !== 'function') return () => {}
    const matrixes: Matrix[] = [this.transformMatrix]
    let distWidth = this.width
    let distHeight = this.height
    transformer({
      resize: (width, height, offset) => {
        if (offset) {
          matrixes.push(translate(offset.x, offset.y))
        }
        if (width < 0 || height < 0) {
          return
        }
        distWidth = width
        distHeight = height
      },
      scale: (sx, sy = sx, origin = this.transformOrigin) => {
        matrixes.push(scale(sx, sy, origin.x, origin.y))
      },
      rotate: (rotation, origin = this.transformOrigin) => {
        matrixes.push(rotate(rotation, origin.x, origin.y))
      },
      rotateDEG: (angle, origin = this.transformOrigin) => {
        matrixes.push(rotateDEG(angle, origin.x, origin.y))
      },
      translate(tx, ty = 0) {
        matrixes.push(translate(tx, ty))
      },
      push(matrix: Matrix) {
        matrixes.push(matrix)
      },
    })
    this.width = distWidth
    this.height = distHeight
    this.transformOrigin = this.calcTransformOrigin(
      this.transformOriginStyle,
      distWidth,
      distHeight
    )
    this.matrix = compose(matrixes)

    return (target = this.element) => {
      if (!target) return
      const style = getComputedStyle(target)
      const boxSizing = style.boxSizing
      if (boxSizing === 'border-box') {
        target.style.width = `${this.width}px`
        target.style.height = `${this.height}px`
      } else if (boxSizing === 'content-box') {
        target.style.width = `${
          this.width -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight) -
          parseFloat(style.borderLeftWidth) -
          parseFloat(style.borderRightWidth)
        }px`
        target.style.height = `${
          this.height -
          parseFloat(style.paddingTop) -
          parseFloat(style.paddingBottom) -
          parseFloat(style.borderTopWidth) -
          parseFloat(style.borderBottomWidth)
        }px`
      }
      const decompose = decomposeTSR(this.cssMatrix)
      const { translate: t, rotation: r, scale: s } = decompose
      target.style.transform = `translate3d(${t.tx}px,${t.ty}px,0) scale(${s.sx},${s.sy}) rotate(${r.angle}rad)`
      return decompose
    }
  }
}
export class Position {
  coordinate: ElementCoord
  position: Point
  constructor(coordinate: ElementCoord, position: IPoint) {
    this.coordinate = coordinate
    this.position = new Point(position?.x, position?.y)
  }

  get absolutePosition() {
    return applyToPoint(this.coordinate.absoluteMatrix, this.position)
  }

  get clientPosition() {
    return applyToPoint(this.coordinate.clientMatrix, this.position)
  }

  get x() {
    return this.position.x
  }

  get absoluteX() {
    return this.absolutePosition.x
  }

  get clientX() {
    return this.clientPosition.x
  }

  get y() {
    return this.position.y
  }

  get absoluteY() {
    return this.absolutePosition.y
  }

  get clientY() {
    return this.clientPosition.y
  }
}

export class ElementBox<Ref = any> {
  element: HTMLElement
  ref: Ref
  coordinate: ElementCoord
  constructor(element: HTMLElement, ref?: Ref) {
    this.element = element
    this.ref = ref
    this.coordinate = new ElementCoord(element)
  }

  get transformMatrix() {
    return this.coordinate.transformMatrix
  }

  get transformOrigin() {
    return this.coordinate.transformOrigin
  }

  get width() {
    return this.coordinate.width
  }

  get height() {
    return this.coordinate.height
  }

  get rotation() {
    return decomposeTSR(this.transformMatrix)?.rotation?.angle
  }

  get scale() {
    return decomposeTSR(this.transformMatrix)?.scale
  }

  get translate() {
    return decomposeTSR(this.transformMatrix)?.translate
  }

  get vertexes() {
    return {
      lt: new Position(this.coordinate, {
        x: 0,
        y: 0,
      }),
      rt: new Position(this.coordinate, {
        x: this.width,
        y: 0,
      }),
      rb: new Position(this.coordinate, {
        x: this.width,
        y: this.height,
      }),
      lb: new Position(this.coordinate, {
        x: 0,
        y: this.height,
      }),
    }
  }

  get centers() {
    return {
      lc: new Position(this.coordinate, {
        x: 0,
        y: this.height / 2,
      }),
      rc: new Position(this.coordinate, {
        x: this.width,
        y: this.height / 2,
      }),
      cc: new Position(this.coordinate, {
        x: this.width / 2,
        y: this.height / 2,
      }),
      ct: new Position(this.coordinate, {
        x: this.width / 2,
        y: 0,
      }),
      cb: new Position(this.coordinate, {
        x: this.width / 2,
        y: this.height,
      }),
    }
  }

  get points() {
    return {
      ...this.vertexes,
      ...this.centers,
    }
  }

  get boundingClientRect() {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    const vertexes: Record<string, Position> = this.vertexes
    for (let key in vertexes) {
      const p = vertexes[key]
      if (p.clientX < minX) {
        minX = p.clientX
      }
      if (p.clientX > maxX) {
        maxX = p.clientX
      }
      if (p.clientY < minY) {
        minY = p.clientY
      }
      if (p.clientY > maxY) {
        maxY = p.clientY
      }
    }
    return new Rect(minX, minY, maxX - minX, maxY - minY)
  }

  get boundingRect() {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    const vertexes: Record<string, Position> = this.vertexes
    for (let key in vertexes) {
      const p = vertexes[key]
      if (p.absoluteX < minX) {
        minX = p.absoluteX
      }
      if (p.absoluteX > maxX) {
        maxX = p.absoluteX
      }
      if (p.absoluteY < minY) {
        minY = p.absoluteY
      }
      if (p.absoluteY > maxY) {
        maxY = p.absoluteY
      }
    }
    return new Rect(minX, minY, maxX - minX, maxY - minY)
  }

  get matrixRect(): MatrixRect {
    return new MatrixRect(this)
  }

  transform(transformer: (transformer: ITransformer) => void) {
    if (typeof transformer !== 'function') return () => {}
    const coord = this.coordinate
    return coord.transform((t) => {
      transformer({
        ...t,
        translate: (tx, ty) => {
          t.push(inverse(coord.absoluteMatrix))
          t.translate(tx, ty)
          t.push(coord.absoluteMatrix)
        },
      })
    })
  }
}

export class ElementGroupBox<Ref = any> {
  coordinate: ElementCoord
  elementBoxes: ElementBox<Ref>[]
  transformMatrix: Matrix = identity()
  transformOrigin: Position
  vertexes: Record<VertexTypes, Position>
  constructor(elements: HTMLElement[] = [], refs: Ref[] = []) {
    this.coordinate = new ElementCoord()
    this.initElementBoxes(elements, refs)
    this.calcVertexes()
    this.initTransformOrigin()
  }

  get width() {
    const vertexes = this.vertexes
    return calcDistanceOfPoints(vertexes.rt, vertexes.lt)
  }

  get height() {
    const vertexes = this.vertexes
    return calcDistanceOfPoints(vertexes.lb, vertexes.lt)
  }

  get rotation() {
    return decomposeTSR(this.transformMatrix)?.rotation?.angle
  }

  get scale() {
    return decomposeTSR(this.transformMatrix)?.scale
  }

  get translate() {
    return decomposeTSR(this.transformMatrix)?.translate
  }

  get boundingClientRect() {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    const vertexes: Record<string, Position> = this.vertexes
    for (let key in vertexes) {
      const p = vertexes[key]
      if (p.clientX < minX) {
        minX = p.clientX
      }
      if (p.clientX > maxX) {
        maxX = p.clientX
      }
      if (p.clientY < minY) {
        minY = p.clientY
      }
      if (p.clientY > maxY) {
        maxY = p.clientY
      }
    }
    return new Rect(minX, minY, maxX - minX, maxY - minY)
  }

  get boundingRect() {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    const vertexes: Record<string, Position> = this.vertexes
    for (let key in vertexes) {
      const p = vertexes[key]
      if (p.absoluteX < minX) {
        minX = p.absoluteX
      }
      if (p.absoluteX > maxX) {
        maxX = p.absoluteX
      }
      if (p.absoluteY < minY) {
        minY = p.absoluteY
      }
      if (p.absoluteY > maxY) {
        maxY = p.absoluteY
      }
    }
    return new Rect(minX, minY, maxX - minX, maxY - minY)
  }

  get matrixRect(): MatrixRect {
    return new MatrixRect(this)
  }

  get centers() {
    const vertexes = this.vertexes
    const createPosition = (start: IPoint, end: IPoint) => {
      return new Position(this.coordinate, calcCenterPoint(start, end))
    }
    return {
      lc: createPosition(vertexes.lt, vertexes.lb),
      ct: createPosition(vertexes.lt, vertexes.rt),
      cb: createPosition(vertexes.lb, vertexes.rb),
      cc: createPosition(vertexes.lt, vertexes.rb),
      rc: createPosition(vertexes.rt, vertexes.rb),
    }
  }

  get points() {
    return {
      ...this.vertexes,
      ...this.centers,
    }
  }

  private initElementBoxes(elements: HTMLElement[], refs: Ref[] = []) {
    this.elementBoxes = elements.map(
      (element, i) => new ElementBox(element, refs[i])
    )
  }

  private initTransformOrigin() {
    this.transformOrigin = this.centers.cc
  }

  private calcVertexes() {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    this.elementBoxes.forEach((box) => {
      const vertexes: Record<string, Position> = box.vertexes
      for (let key in box.vertexes) {
        const p = vertexes[key]
        if (p.absoluteX < minX) {
          minX = p.absoluteX
        }
        if (p.absoluteX > maxX) {
          maxX = p.absoluteX
        }
        if (p.absoluteY < minY) {
          minY = p.absoluteY
        }
        if (p.absoluteY > maxY) {
          maxY = p.absoluteY
        }
      }
    })
    const rect = new Rect(minX, minY, maxX - minX, maxY - minY)
    this.vertexes = {
      lt: new Position(this.coordinate, {
        x: rect.left,
        y: rect.top,
      }),
      lb: new Position(this.coordinate, {
        x: rect.left,
        y: rect.bottom,
      }),
      rt: new Position(this.coordinate, {
        x: rect.right,
        y: rect.top,
      }),
      rb: new Position(this.coordinate, {
        x: rect.right,
        y: rect.bottom,
      }),
    }
  }

  transform(transformer: (transformer: ITransformer) => void) {
    if (typeof transformer !== 'function') return () => {}
    const transformOrigin = this.transformOrigin
    const patches: (() => void)[] = []
    this.elementBoxes.forEach((box) => {
      patches.push(
        box.transform((t) => {
          transformer({
            resize: (width = this.width, height = this.height, offset) => {
              if (width <= 0 || height <= 0) return
              const widthRatio = width / this.width
              const heightRatio = height / this.height
              t.resize(box.width * widthRatio, box.height * heightRatio, offset)
            },
            scale: (sx, sy = sx, origin = transformOrigin) => {
              t.scale(sx, sy, origin)
            },
            translate: (tx, ty) => {
              t.translate(tx, ty)
            },
            rotate: (rotation, origin = transformOrigin) => {
              t.rotate(rotation, origin)
            },
            rotateDEG: (angle, origin = transformOrigin) => {
              t.rotateDEG(angle, origin)
            },
            push: (matrix: Matrix) => {
              t.push(matrix)
            },
          })
        })
      )
    })
    this.calcVertexes()
    return () => {
      patches.forEach((fn) => fn())
    }
  }
}

export class MatrixRect<Ref = any> {
  matrix: Matrix
  inverse: Matrix
  decompose: Transform
  width: number
  height: number
  origin: Position
  boundingClientRect: Rect
  boundingRect: Rect
  constructor(box: ElementBox<Ref> | ElementGroupBox<Ref>) {
    this.matrix = box.transformMatrix
    this.decompose = decomposeTSR(this.matrix)
    this.inverse = inverse(this.matrix)
    this.width = box.width
    this.height = box.height
    this.origin = box.transformOrigin
    this.boundingClientRect = box.boundingClientRect
    this.boundingRect = box.boundingRect
  }
}

export function createElementBox<Node extends IElementNode>(
  nodes: Node[] = []
) {
  if (!nodes?.length) return
  if (nodes.length == 1) return new ElementBox(nodes[0].getElement(), nodes[0])
  return new ElementGroupBox(
    nodes.map((node) => node.getElement()),
    nodes
  )
}
