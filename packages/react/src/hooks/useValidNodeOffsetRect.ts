import { useState, useEffect, useRef, useCallback } from 'react'
import { TreeNode, CursorStatus, CursorDragType } from '@designable/core'
import { requestIdle, cancelIdle } from '@designable/shared'
import { ResizeObserver } from '@juggle/resize-observer'
import { useViewport } from './useViewport'
import { useDesigner } from './useDesigner'

const isEqualRect = (rect1: DOMRect, rect2: DOMRect) => {
  return (
    rect1?.x === rect2?.x &&
    rect1?.y === rect2?.y &&
    rect1?.width === rect2?.width &&
    rect1?.height === rect2?.height
  )
}

export const useValidNodeOffsetRect = (node: TreeNode) => {
  const engine = useDesigner()
  const viewport = useViewport()
  const [, forceUpdate] = useState(null)
  const rectRef = useRef<DOMRect>(viewport.getValidNodeOffsetRect(node))
  const idleTaskRef = useRef(null)
  const unmountRef = useRef(false)
  const observerRef = useRef(null)
  const element = viewport.findElementById(node?.id)

  const compute = useCallback(() => {
    if (unmountRef.current) return
    if (
      engine.cursor.status !== CursorStatus.Normal &&
      engine.cursor.dragType === CursorDragType.Normal
    )
      return
    const nextRect = viewport.getValidNodeOffsetRect(node)
    if (!isEqualRect(rectRef.current, nextRect) && nextRect) {
      rectRef.current = nextRect
      forceUpdate(nextRect)
    }
  }, [viewport, node])

  useEffect(() => {
    if (!element || !element.isConnected) return
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    observerRef.current = new ResizeObserver(() => {
      compute()
    })
    observerRef.current.observe(element)
    return () => {
      observerRef.current.disconnect()
    }
  }, [element, viewport])

  useEffect(() => {
    unmountRef.current = false
    const requestIdleTask = () => {
      cancelIdle(idleTaskRef.current)
      idleTaskRef.current = requestIdle(() => {
        compute()
        requestIdleTask()
      })
    }
    requestIdleTask()
    return () => {
      unmountRef.current = true
      cancelIdle(idleTaskRef.current)
    }
  }, [node])

  return rectRef.current
}
