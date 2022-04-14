import React from 'react'
import { useTranslateHelper, useCursor, usePrefix } from '../../hooks'
import { observer } from '@formily/reactive-react'
import { CursorDragType, CursorStatus } from '@designable/core'

export const SnapLine = observer(() => {
  const cursor = useCursor()
  const translateHelper = useTranslateHelper()
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
    !translateHelper ||
    cursor.dragType !== CursorDragType.Translate
  )
    return null
  return (
    <>
      {translateHelper.closestSnapLines.map((line, key) => {
        if (line.type !== 'normal') return null
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

SnapLine.displayName = 'SnapLine'
