export interface IPoint {
  x: number
  y: number
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
