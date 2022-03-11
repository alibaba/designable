import { useState, useEffect, useRef, useCallback } from 'react'
import { TreeNode, CursorStatus, CursorDragType } from '@designable/core'
import { LayoutObserver } from '@designable/shared'
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
  const unmountRef = useRef(false)
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
    const layoutObserver = new LayoutObserver(compute)
    layoutObserver.observe(element)
    return () => {
      layoutObserver.disconnect()
    }
  }, [element, viewport])

  return rectRef.current
}
