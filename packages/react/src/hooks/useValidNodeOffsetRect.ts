import { useState, useEffect, useMemo, useCallback } from 'react'
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

export const useValidNodeOffsetRect = (node: TreeNode | null) => {
  const engine = useDesigner()
  const viewport = useViewport()
  const [, forceUpdate] = useState(null)
  const rectRef = useMemo(
    () => ({ current: node ? viewport.getValidNodeOffsetRect(node) : null }),
    [viewport, node]
  )

  const element = node ? viewport.findElementById(node?.id) : null

  const compute = useCallback(() => {
    if (!node) return
    if (
      engine.cursor.status !== CursorStatus.Normal &&
      engine.cursor.dragType === CursorDragType.Move
    )
      return
    const nextRect = viewport.getValidNodeOffsetRect(node)
    if (!isEqualRect(rectRef.current as DOMRectReadOnly , nextRect  as DOMRectReadOnly) && (nextRect  as DOMRectReadOnly)) {
      rectRef.current = nextRect
      forceUpdate(null)
    }
  }, [viewport, node])

  useEffect(() => {
    const layoutObserver = new LayoutObserver(compute)
    if (element) layoutObserver.observe(element)
    return () => {
      layoutObserver.disconnect()
    }
  }, [node, viewport, element])
  return rectRef.current
}
