import { isValidNumber } from './types'
export interface IPoint {
  x: number
  y: number
}

export interface ILineSegment {
  start: IPoint
  end: IPoint
}

export interface IRectEdgeLines {
  v: IAlignLineSegment[]
  h: IAlignLineSegment[]
}

export type IAlignLineSegment = {
  distance?: number
  start: IPoint
  end: IPoint
}

export function isRect(rect: any): rect is IRect {
  return rect?.x && rect?.y && rect?.width && rect?.height
}

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

export class LineSegment {
  start: IPoint
  end: IPoint
  constructor(start: IPoint, end: IPoint) {
    this.start = { ...start }
    this.end = { ...end }
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

export function calcEdgeLinesOfRect(rect: IRect): IRectEdgeLines {
  return {
    v: [
      new LineSegment(
        new Point(rect.x, rect.y),
        new Point(rect.x, rect.y + rect.height)
      ),
      new LineSegment(
        new Point(rect.x + rect.width / 2, rect.y),
        new Point(rect.x + rect.width / 2, rect.y + rect.height)
      ),
      new LineSegment(
        new Point(rect.x + rect.width, rect.y),
        new Point(rect.x + rect.width, rect.y + rect.height)
      ),
    ],
    h: [
      new LineSegment(
        new Point(rect.x, rect.y),
        new Point(rect.x + rect.width, rect.y)
      ),
      new LineSegment(
        new Point(rect.x, rect.y + rect.height / 2),
        new Point(rect.x + rect.width, rect.y + rect.height / 2)
      ),
      new LineSegment(
        new Point(rect.x, rect.y + rect.height),
        new Point(rect.x + rect.width, rect.y + rect.height)
      ),
    ],
  }
}

export function calcCombineAlignLineSegment(
  target: ILineSegment,
  source: ILineSegment
): ILineSegment {
  if (target.start.x === target.end.x) {
    return new LineSegment(
      new Point(
        target.start.x,
        target.start.y > source.start.y ? source.start.y : target.start.y
      ),
      new Point(
        target.start.x,
        target.end.y > source.end.y ? target.end.y : source.end.y
      )
    )
  }

  return new LineSegment(
    new Point(
      target.start.x > source.start.x ? source.start.x : target.start.x,
      target.start.y
    ),
    new Point(
      target.end.x > source.end.x ? target.end.x : source.end.x,
      target.end.y
    )
  )
}

/**
 * 求与目标矩形的鼠标跟随克隆矩形
 * @param rect
 * @param cursor
 * @param offset
 * @returns
 */
export function calcCursorEdgeLinesOfRect(
  rect: IRect,
  cursor: IPoint,
  offset: IPoint
): IRectEdgeLines {
  const vertex = new Point(cursor.x - offset.x, cursor.y - offset.y)
  return {
    v: [
      new LineSegment(
        new Point(vertex.x, vertex.y),
        new Point(vertex.x, vertex.y + rect.height)
      ),
      new LineSegment(
        new Point(vertex.x + rect.width / 2, vertex.y),
        new Point(vertex.x + rect.width / 2, vertex.y + rect.height)
      ),
      new LineSegment(
        new Point(vertex.x + rect.width, vertex.y),
        new Point(vertex.x + rect.width, vertex.y + rect.height)
      ),
    ],
    h: [
      new LineSegment(
        new Point(vertex.x, vertex.y),
        new Point(vertex.x + rect.width, vertex.y)
      ),
      new LineSegment(
        new Point(vertex.x, vertex.y + rect.height / 2),
        new Point(vertex.x + rect.width, vertex.y + rect.height / 2)
      ),
      new LineSegment(
        new Point(vertex.x, vertex.y + rect.height),
        new Point(vertex.x + rect.width, vertex.y + rect.height)
      ),
    ],
  }
}

export function calcClosestEdgeLines(
  target: IRectEdgeLines,
  source: IRectEdgeLines,
  maxDistance = 5
): IRectEdgeLines {
  const h: IAlignLineSegment[] = []
  const v: IAlignLineSegment[] = []

  target?.h?.forEach((targetLine) => {
    source?.h?.forEach((sourceLine) => {
      const distance = Math.abs(targetLine.start.y - sourceLine.start.y)
      if (distance < maxDistance) {
        const line: IAlignLineSegment = calcCombineAlignLineSegment(
          targetLine,
          sourceLine
        )
        line.distance = distance
        h.push(line)
      }
    })
  })

  target?.v?.forEach((targetLine) => {
    source?.v?.forEach((sourceLine) => {
      const distance = Math.abs(targetLine.start.x - sourceLine.start.x)
      if (distance < maxDistance) {
        const line: IAlignLineSegment = calcCombineAlignLineSegment(
          targetLine,
          sourceLine
        )
        line.distance = distance
        v.push(line)
      }
    })
  })
  return { h, v }
}

export function calcDistanceOfLienSegment(
  target: ILineSegment,
  source: ILineSegment
) {
  if (target.start.x === source.end.x) {
    return Math.abs(source.start.y - target.start.y)
  }
  return Math.abs(source.start.x - target.start.x)
}

export function calcOffsetOfAlignLineSegmentToEdge(
  line: IAlignLineSegment,
  current: IRect
) {
  const edges = calcEdgeLinesOfRect(current)
  const isVerticalLine = line.start.x === line.end.x
  if (isVerticalLine) {
    return { x: calcMinDistanceValue(edges.x, line.start.x) - current.x, y: 0 }
  }
  function calcEdgeLinesOfRect(rect: IRect) {
    return {
      x: [rect.x, rect.x + rect.width / 2, rect.x + rect.width],
      y: [rect.y, rect.y + rect.height / 2, rect.y + rect.height],
    }
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
