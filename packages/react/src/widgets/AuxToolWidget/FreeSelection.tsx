import React from 'react'
import { useCursor, usePrefix, useViewport } from '../../hooks'
import { observer } from '@formily/reactive-react'
import { CursorStatus, CursorType } from '@inbiz/core'
import { calcRectByStartEndPoint } from '@inbiz/shared'
import cls from 'classnames'

export const FreeSelection = observer(() => {
  const cursor = useCursor()
  const viewport = useViewport()
  const prefix = usePrefix('aux-free-selection')
  const createSelectionStyle = () => {
    const startDragPoint = viewport.getOffsetPoint({
      x: cursor.dragStartPosition.topClientX,
      y: cursor.dragStartPosition.topClientY,
    })
    const currentPoint = viewport.getOffsetPoint({
      x: cursor.position.topClientX,
      y: cursor.position.topClientY,
    })
    const rect = calcRectByStartEndPoint(
      startDragPoint,
      currentPoint,
      viewport.scrollX - cursor.dragStartScrollOffset.scrollX,
      viewport.scrollY - cursor.dragStartScrollOffset.scrollY
    )
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0.2,
      borderWidth: 1,
      borderStyle: 'solid',
      transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
      height: rect.height,
      width: rect.width,
      pointerEvents: 'none',
      boxSizing: 'border-box',
      zIndex: 1,
    }
    return baseStyle
  }

  if (
    cursor.status !== CursorStatus.Dragging ||
    cursor.type !== CursorType.Selection
  )
    return null
  return <div className={cls(prefix)} style={createSelectionStyle()}></div>
})
