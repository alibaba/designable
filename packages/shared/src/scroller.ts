import { IPoint } from './coordinate'
import { createUniformSpeedAnimation, calcSpeedFactor } from './animation'
import { isFn, isWindow } from './types'

const MAX_SPEED = 80 // px/s

export type ScrollDirection = 'begin' | 'end'

export interface IAutoScrollBasicInfo {
  direction: ScrollDirection
  speedFactor: number
  speed: number
}

export const calcAutoScrollBasicInfo = (
  point: IPoint,
  axis: 'x' | 'y',
  viewport: DOMRect,
  maxSpeed = MAX_SPEED
): IAutoScrollBasicInfo | null => {
  const { left, right, top, bottom } = viewport
  const { x, y } = point

  let begin: number
  let end: number
  let pos: number
  let speedFactor: number
  if (axis === 'x') {
    begin = left
    end = right
    pos = x
  } else {
    begin = top
    end = bottom
    pos = y
  }

  const scrollerSize = end - begin

  const moveDistance = scrollerSize > 400 ? 100 : scrollerSize / 3
  if (end - pos < moveDistance) {
    return {
      direction: 'end',
      speedFactor,
      speed: maxSpeed * calcSpeedFactor(end - pos, moveDistance),
    }
  } else if (pos - begin < moveDistance) {
    return {
      direction: 'begin',
      speedFactor,
      speed: maxSpeed * calcSpeedFactor(pos - begin, moveDistance),
    }
  }

  return null
}

export const updateScrollValue = (
  element: HTMLElement | Window,
  axis: 'x' | 'y',
  value: number,
  callback?: (scrollValue: number) => void
) => {
  if (element) {
    if (!isWindow(element)) {
      if (axis === 'x') {
        if (element.scrollLeft + value > element.scrollWidth) return
        element.scrollLeft += value
        if (isFn(callback)) {
          callback(element.scrollLeft)
        }
      } else {
        if (element.scrollTop + value > element.scrollHeight) return
        element.scrollTop += value
        if (isFn(callback)) {
          callback(element.scrollTop)
        }
      }
    } else {
      if (axis === 'x') {
        element.scrollBy({
          left: value,
          behavior: 'smooth',
        })
      } else {
        element.scrollBy({
          top: value,
          behavior: 'smooth',
        })
      }
      if (isFn(callback)) {
        callback(value)
      }
    }
  }
}

export const scrollAnimate = (
  element: HTMLElement | Window,
  axis: 'x' | 'y',
  direction: 'begin' | 'end',
  speed: number,
  callback?: (scrollValue: number) => void
) => {
  return createUniformSpeedAnimation(speed, (delta) => {
    updateScrollValue(
      element,
      axis,
      direction === 'begin' ? 0 - delta : delta,
      callback
    )
  })
}
