import { useState, useEffect, useMemo } from 'react'
import { TreeNode, CursorStatus, CursorDragType } from '@designable/core'
import { PaintObserver, Rect } from '@designable/shared'
import { useViewport } from './useViewport'
import { useDesigner } from './useDesigner'

const isEqualRect = (rect1: Rect, rect2: Rect) => {
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
  const rectRef = useMemo(
    () => ({ current: viewport.getValidNodeOffsetRect(node) }),
    [viewport]
  )

  const element = viewport.findElementById(node?.id)

  useEffect(() => {
    const compute = () => {
      if (
        engine.cursor.status !== CursorStatus.Normal &&
        engine.cursor.dragType === CursorDragType.Move
      )
        return
      const nextRect = viewport.getValidNodeOffsetRect(node)
      if (!isEqualRect(rectRef.current, nextRect) && nextRect) {
        rectRef.current = nextRect
        forceUpdate([])
      }
    }
    const paintObserver = new PaintObserver(compute)
    if (element) paintObserver.observe(element)
    return () => {
      paintObserver.disconnect()
    }
  }, [node, viewport, element])
  return rectRef.current
}
