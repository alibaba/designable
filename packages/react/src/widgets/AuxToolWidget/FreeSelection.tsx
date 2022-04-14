import React from 'react'
import { useCursor, usePrefix, useViewport, useOperation } from '../../hooks'
import { observer } from '@formily/reactive-react'
import { CursorDragType, CursorStatus } from '@designable/core'
import { calcRectByStartEndPoint } from '@designable/shared'
import cls from 'classnames'

export const FreeSelection = observer(() => {
  const cursor = useCursor()
  const viewport = useViewport()
  const operation = useOperation()
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
      viewport.dragScrollXDelta,
      viewport.dragScrollYDelta
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
    operation.moveHelper.hasDragNodes ||
    cursor.status !== CursorStatus.Dragging ||
    cursor.dragType !== CursorDragType.Move
  )
    return null

  return <div className={cls(prefix)} style={createSelectionStyle()}></div>
})
