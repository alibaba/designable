import { isValidNumber } from './types'
export interface IPoint {
  x: number
  y: number
}

export interface ILineSegment {
  start: IPoint
  end: IPoint
}

export type IAlignLineSegment<ExtendsProperty = {}> = {
  distance?: number
  start: IPoint
  end: IPoint
} & ExtendsProperty

export function isPoint(val: any): val is IPoint {
  return isValidNumber(val?.x) && isValidNumber(val?.y)
}

export function isLineSegment(val: any): val is ILineSegment {
  return isPoint(val?.start) && isPoint(val?.end)
}

export function isAlignLineSegment(val: any): val is IAlignLineSegment {
  return (
    isLineSegment(val) &&
    (val.start.x === val.end.x || val.start.y === val.end.y)
  )
}

export class Point implements IPoint {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export interface IRect {
  x: number
  y: number
  width: number
  height: number
}

export enum RectQuadrant {
  Inner1 = 'I1', //内部第一象限
  Inner2 = 'I2', //内部第二象限
  Inner3 = 'I3', //内部第三象限
  Inner4 = 'I4', //内部第四象限
  Outer1 = 'O1', //内部第五象限
  Outer2 = 'O2', //内部第六象限
  Outer3 = 'O3', //内部第七象限
  Outer4 = 'O4', //内部第八象限
}

export interface IPointToRectRelative {
  quadrant: RectQuadrant
  distance: number
}

export function isPointInRect(point: IPoint, rect: IRect, sensitive = true) {
  const boundSensor = (value: number) => {
    if (!sensitive) return 0
    const sensor = value * 0.1
    if (sensor > 20) return 20
    if (sensor < 10) return 10
    return sensor
  }

  return (
    point.x >= rect.x + boundSensor(rect.width) &&
    point.x <= rect.x + rect.width - boundSensor(rect.width) &&
    point.y >= rect.y + boundSensor(rect.height) &&
    point.y <= rect.y + rect.height - boundSensor(rect.height)
  )
}

export function getRectPoints(source: IRect) {
  const p1 = new Point(source.x, source.y)
  const p2 = new Point(source.x + source.width, source.y)
  const p3 = new Point(source.x + source.width, source.y + source.height)
  const p4 = new Point(source.x, source.y + source.height)
  return [p1, p2, p3, p4]
}

export function isRectInRect(target: IRect, source: IRect) {
  const [p1, p2, p3, p4] = getRectPoints(source)
  return (
    isPointInRect(p1, target, false) &&
    isPointInRect(p2, target, false) &&
    isPointInRect(p3, target, false) &&
    isPointInRect(p4, target, false)
  )
}

export function isCrossRectInRect(target: IRect, source: IRect) {
  const targetCenterPoint = new Point(
    target.x + target.width / 2,
    target.y + target.height / 2
  )
  const sourceCenterPoint = new Point(
    source.x + source.width / 2,
    source.y + source.height / 2
  )
  return (
    Math.abs(targetCenterPoint.x - sourceCenterPoint.x) <=
      target.width / 2 + source.width / 2 &&
    Math.abs(targetCenterPoint.y - sourceCenterPoint.y) <=
      target.height / 2 + source.height / 2
  )
}

/**
 * 计算点在矩形的哪个象限
 * @param point
 * @param rect
 */
export function calcQuadrantOfPointToRect(point: IPoint, rect: IRect) {
  const isInner = isPointInRect(point, rect)
  if (point.x <= rect.x + rect.width / 2) {
    if (point.y <= rect.y + rect.height / 2) {
      if (isInner) {
        return RectQuadrant.Inner1
      } else {
        return RectQuadrant.Outer1
      }
    } else {
      if (isInner) {
        return RectQuadrant.Inner4
      } else {
        return RectQuadrant.Outer4
      }
    }
  } else {
    if (point.y <= rect.y + rect.height / 2) {
      if (isInner) {
        return RectQuadrant.Inner2
      } else {
        return RectQuadrant.Outer2
      }
    } else {
      if (isInner) {
        return RectQuadrant.Inner3
      } else {
        return RectQuadrant.Outer3
      }
    }
  }
}

export function calcDistanceOfPointToRect(point: IPoint, rect: IRect) {
  let minX = Math.min(
    Math.abs(point.x - rect.x),
    Math.abs(point.x - (rect.x + rect.width))
  )
  let minY = Math.min(
    Math.abs(point.y - rect.y),
    Math.abs(point.y - (rect.y + rect.height))
  )
  if (point.x >= rect.x && point.x <= rect.x + rect.width) {
    minX = 0
  }
  if (point.y >= rect.y && point.y <= rect.y + rect.height) {
    minY = 0
  }

  return Math.sqrt(minX ** 2 + minY ** 2)
}

export function calcDistancePointToEdge(point: IPoint, rect: IRect) {
  const distanceTop = Math.abs(point.y - rect.y)
  const distanceBottom = Math.abs(point.y - (rect.y + rect.height))
  const distanceLeft = Math.abs(point.x - rect.x)
  const distanceRight = Math.abs(point.x - (rect.x + rect.width))
  return Math.min(distanceTop, distanceBottom, distanceLeft, distanceRight)
}

export function isNearAfter(point: IPoint, rect: IRect, inline = false) {
  if (inline) {
    return (
      Math.abs(point.x - rect.x) + Math.abs(point.y - rect.y) >
      Math.abs(point.x - (rect.x + rect.width)) +
        Math.abs(point.y - (rect.y + rect.height))
    )
  }
  return Math.abs(point.y - rect.y) > Math.abs(point.y - (rect.y + rect.height))
}

/**
 * 计算点鱼矩形的相对位置信息
 * @param point
 * @param rect
 */
export function calcRelativeOfPointToRect(
  point: IPoint,
  rect: IRect
): IPointToRectRelative {
  const distance = calcDistanceOfPointToRect(point, rect)
  const quadrant = calcQuadrantOfPointToRect(point, rect)
  return {
    quadrant,
    distance,
  }
}

export function calcBoundingRect(rects: IRect[]) {
  if (!rects?.length) return
  if (rects?.length === 1 && !rects[0]) return
  let minTop = Infinity
  let maxBottom = -Infinity
  let minLeft = Infinity
  let maxRight = -Infinity
  rects.forEach((item) => {
    const rect =
      typeof DOMRect !== 'undefined' &&
      new DOMRect(item.x, item.y, item.width, item.height)
    if (rect.top <= minTop) {
      minTop = rect.top
    }
    if (rect.bottom >= maxBottom) {
      maxBottom = rect.bottom
    }
    if (rect.left <= minLeft) {
      minLeft = rect.left
    }
    if (rect.right >= maxRight) {
      maxRight = rect.right
    }
  })
  return (
    typeof DOMRect !== 'undefined' &&
    new DOMRect(minLeft, minTop, maxRight - minLeft, maxBottom - minTop)
  )
}

export function calcRectByStartEndPoint(
  startPoint: IPoint,
  endPoint: IPoint,
  scrollX = 0,
  scrollY = 0
) {
  let drawStartX = 0,
    drawStartY = 0
  if (
    endPoint.x + scrollX >= startPoint.x &&
    endPoint.y + scrollY >= startPoint.y
  ) {
    //4象限
    drawStartX = startPoint.x
    drawStartY = startPoint.y
    return (
      typeof DOMRect !== 'undefined' &&
      new DOMRect(
        drawStartX - scrollX,
        drawStartY - scrollY,
        Math.abs(endPoint.x - startPoint.x + scrollX),
        Math.abs(endPoint.y - startPoint.y + scrollY)
      )
    )
  } else if (
    endPoint.x + scrollX < startPoint.x &&
    endPoint.y + scrollY < startPoint.y
  ) {
    //1象限
    drawStartX = endPoint.x
    drawStartY = endPoint.y
    return (
      typeof DOMRect !== 'undefined' &&
      new DOMRect(
        drawStartX,
        drawStartY,
        Math.abs(endPoint.x - startPoint.x + scrollX),
        Math.abs(endPoint.y - startPoint.y + scrollY)
      )
    )
  } else if (
    endPoint.x + scrollX < startPoint.x &&
    endPoint.y + scrollY >= startPoint.y
  ) {
    //3象限
    drawStartX = endPoint.x
    drawStartY = startPoint.y
    return (
      typeof DOMRect !== 'undefined' &&
      new DOMRect(
        drawStartX - scrollX,
        drawStartY - scrollY,
        Math.abs(endPoint.x - startPoint.x + scrollX),
        Math.abs(endPoint.y - startPoint.y + scrollY)
      )
    )
  } else {
    //2象限
    drawStartX = startPoint.x
    drawStartY = endPoint.y
    return (
      typeof DOMRect !== 'undefined' &&
      new DOMRect(
        drawStartX,
        drawStartY,
        Math.abs(endPoint.x - startPoint.x + scrollX),
        Math.abs(endPoint.y - startPoint.y + scrollY)
      )
    )
  }
}

/**
 * 计算目标矩形与当前矩形最近的边的对齐线
 * @param current
 * @param target
 */
export function calcAlignLineSegmentOfEdgeToRectAndCursor<
  T extends IAlignLineSegment
>(current: IRect, target: IRect): { vertical: T; horizontal: T } {
  const currentEdges = calcEdgeLinesOfRect(current)
  const targetEdges = calcEdgeLinesOfRect(target)
  const xDistances = calcMinIndex(
    calcEdgeLinesDistance(currentEdges.x, targetEdges.x)
  )
  const yDistances = calcMinIndex(
    calcEdgeLinesDistance(currentEdges.y, targetEdges.y)
  )
  const verticalLine = {
    distance: xDistances.value,
    start: {
      x: targetEdges.x[xDistances.indexes[1]],
      y: Math.min(current.y, target.y),
    },
    end: {
      x: targetEdges.x[xDistances.indexes[1]],
      y: Math.max(target.y + target.height, current.y + current.height),
    },
  }
  const horizontalLine = {
    distance: yDistances.value,
    start: {
      y: targetEdges.y[yDistances.indexes[1]],
      x: Math.min(current.x, target.x),
    },
    end: {
      y: targetEdges.y[yDistances.indexes[1]],
      x: Math.max(target.x + target.width, current.x + current.width),
    },
  }
  return {
    vertical: verticalLine as any,
    horizontal: horizontalLine as any,
  }

  function calcMinIndex(values: { value: number; indexes: number[] }[]) {
    let min = values[0]
    for (let i = 0; i < values.length; i++) {
      const distance = values[i]
      if (distance.value <= min.value) {
        min = distance
      }
    }
    return min
  }

  function calcEdgeLinesDistance(
    currentEdges: number[],
    targetEdges: number[]
  ) {
    return targetEdges.reduce((buf, val2, index2) => {
      return buf.concat(
        currentEdges.map((val1, index1) => {
          return { value: Math.abs(val2 - val1), indexes: [index1, index2] }
        })
      )
    }, [])
  }
}

export function calcEdgeLinesOfRect(rect: IRect) {
  return {
    x: [rect.x, rect.x + rect.width / 2, rect.x + rect.width],
    y: [rect.y, rect.y + rect.height / 2, rect.y + rect.height],
  }
}

export function calcOffsetOfAlignLineSegmentToEdge(
  line: IAlignLineSegment,
  current: IRect
) {
  if (!isAlignLineSegment(line)) return
  const edges = calcEdgeLinesOfRect(current)
  const isVerticalLine = line.start.x === line.end.x
  if (isVerticalLine) {
    return { x: calcMinDistanceValue(edges.x, line.start.x) - current.x, y: 0 }
  }
  function calcMinDistanceValue(edges: number[], targetValue: number) {
    let minDistance = Infinity,
      minDistanceIndex = -1
    for (let i = 0; i < edges.length; i++) {
      const distance = Math.abs(edges[i] - targetValue)
      if (minDistance > distance) {
        minDistance = distance
        minDistanceIndex = i
      }
    }
    return edges[minDistanceIndex]
  }

  return { x: 0, y: calcMinDistanceValue(edges.y, line.start.y) - current.y }
}

/**
 * 计算目标对齐线与当前矩形边最近投影距离
 * @param current
 * @param line
 */
export function calcDistanceOfEdgeToAlignLineSegment(
  current: IRect,
  line: IAlignLineSegment
) {
  if (!isAlignLineSegment(line)) return Infinity
  const edges = calcEdgeLinesOfRect(current)
  const isVerticalLine = line.start.x === line.end.x
  if (isVerticalLine) {
    return calcDistances(edges.x, line.start.x)
  }
  function calcDistances(edges: number[], targetValue: number) {
    const distances = []
    for (let i = 0; i < edges.length; i++) {
      distances.push(Math.abs(edges[i] - targetValue))
    }
    return Math.min(...distances)
  }
  return calcDistances(edges.y, line.start.y)
}

export function isEqualPoint(point1: IPoint, point2: IPoint) {
  if (!isPoint(point1) || !isPoint(point2)) return false
  return point1.x === point2.x && point1.y === point2.y
}

export function isEqualLineSegment(line1: ILineSegment, line2: ILineSegment) {
  if (!isLineSegment(line1) || !isLineSegment(line2)) return false
  return (
    isEqualPoint(line1.start, line2.start) && isEqualPoint(line1.end, line2.end)
  )
}

export function clonePoint(point: IPoint) {
  return {
    x: point?.x,
    y: point?.y,
  }
}

export function cloneLineSegment(line: ILineSegment): ILineSegment {
  return {
    start: clonePoint(line?.start),
    end: clonePoint(line?.end),
  }
}

export function cloneAlignLineSegment<Line extends IAlignLineSegment>(
  line: Line
): Line {
  return {
    ...line,
    distance: line?.distance,
    start: clonePoint(line?.start),
    end: clonePoint(line?.end),
  }
}

/**
 * 计算坐标线的小矩形
 * @param line
 * @returns
 */
export function calcRectOfAxisLineSegment(line: ILineSegment) {
  if (!isLineSegment(line)) return
  const isXAxis = line.start.x === line.end.x
  return new DOMRect(
    line.start.x,
    line.start.y,
    isXAxis ? 0 : line.end.x - line.start.x,
    isXAxis ? line.end.y - line.start.y : 0
  )
}

/**
 * 计算距离线
 * @param rect1
 * @param rect2
 */
export function calcDistanceLineSegment(rect1: IRect, rect2: IRect) {}

/**
 * 解析DOM元素偏移值坐标
 * @param element
 * @returns
 */
export const parseTranslatePoint = (element: HTMLElement) => {
  const [x, y] = element?.style?.transform
    ?.match(
      /translate(?:3d)?\(\s*([-\d.]+)[a-z]+?[\s,]+([-\d.]+)[a-z]+?(?:[\s,]+([-\d.]+))?[a-z]+?\s*\)/
    )
    ?.slice(1, 3) ?? [0, 0]
  return new Point(Number(x), Number(y))
}
