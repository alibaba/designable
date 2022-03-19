import React from 'react'
import { useDragLine, useCursor, usePrefix } from '../../hooks'
import { observer } from '@formily/reactive-react'
import { CursorDragType, CursorStatus } from '@designable/core'

export const AlignLine = observer(() => {
  const cursor = useCursor()
  const dragLine = useDragLine()
  const prefix = usePrefix('aux-snap-line')
  const createLineStyle = (rect: DOMRect) => {
    const baseStyle: React.CSSProperties = {
      top: 0,
      left: 0,
      height: rect.height || 1,
      width: rect.width || 1,
      transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
      background: `#b0b1f3`,
      position: 'absolute',
      zIndex: 2,
    }
    return baseStyle
  }
  if (
    cursor.status !== CursorStatus.Dragging ||
    !dragLine ||
    cursor.dragType !== CursorDragType.Translate
  )
    return null
  return (
    <>
      {dragLine.dynamicAlignLines.map((line, key) => {
        return (
          <div
            key={key}
            className={prefix}
            style={createLineStyle(line.rect)}
          ></div>
        )
      })}
    </>
  )
})

AlignLine.displayName = 'AlignLine'
