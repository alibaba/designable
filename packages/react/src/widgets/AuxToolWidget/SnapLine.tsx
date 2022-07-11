import React from 'react'
import { useTransformHelper, useCursor, usePrefix } from '../../hooks'
import { observer } from '@formily/reactive-react'
import { CursorStatus } from '@designable/core'

export const SnapLine = observer(() => {
  const cursor = useCursor()
  const transformHelper = useTransformHelper()
  const prefix = usePrefix('aux-snap-line')
  if (cursor.status !== CursorStatus.Dragging) return null
  return (
    <>
      {transformHelper.thresholdSnapLines.map((line, key) => {
        if (line.type !== 'normal' && line.distance !== 0) return null
        return (
          <div
            key={key}
            className={prefix}
            style={{
              top: 0,
              left: 0,
              height: line.rect.height || 1,
              width: line.rect.width || 1,
              transform: `perspective(1px) translate3d(${line.rect.x}px,${line.rect.y}px,0)`,
              background: `#b0b1f3`,
              position: 'absolute',
              zIndex: 2,
            }}
          ></div>
        )
      })}
    </>
  )
})

SnapLine.displayName = 'SnapLine'
