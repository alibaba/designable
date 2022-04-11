import React from 'react'
import { useDragLine, useCursor, usePrefix } from '../../hooks'
import { observer } from '@formily/reactive-react'
import { CursorDragType, CursorStatus } from '@designable/core'

export const SpaceBox = observer(() => {
  const cursor = useCursor()
  const dragLine = useDragLine()
  const prefix = usePrefix('aux-space-box')
  const createRectStyle = (rect: DOMRect) => {
    const baseStyle: React.CSSProperties = {
      top: 0,
      left: 0,
      height: rect.height,
      width: rect.width,
      transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
      background: `rgba(255, 64, 0, 0.15)`,
      position: 'absolute',
      zIndex: 3,
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
      {dragLine.spaceBoxes.map(({ rect }, key) => {
        return (
          <div key={key} className={prefix} style={createRectStyle(rect)}></div>
        )
      })}
    </>
  )
})

SpaceBox.displayName = 'SpaceBox'
