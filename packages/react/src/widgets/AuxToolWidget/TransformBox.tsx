import React, { useEffect, useRef } from 'react'
import { useSelection, usePrefix, useCursor, useViewport } from '../../hooks'
import { observer } from '@formily/reactive-react'
import { RotateHandler } from './RotateHandler'
import { ResizeHandler } from './ResizeHandler'
import { CursorType } from '@designable/core'
import { transformElement } from '@designable/shared'

export const TransformBox: React.FC = observer(() => {
  const ref = useRef<HTMLDivElement>()
  const prefix = usePrefix('aux-transform-box')
  const innerPrefix = usePrefix('aux-transform-box-inner')
  const selection = useSelection()
  const viewport = useViewport()
  const cursor = useCursor()
  const transformer = selection.transformer
  useEffect(() => {
    return transformer.subscribe(() => {
      transformElement(
        ref.current,
        transformer.width,
        transformer.height,
        transformer.cssClientMatrix,
        -viewport.offsetX + viewport.scrollX,
        -viewport.offsetY + viewport.scrollY
      )
    })
  }, [transformer])
  if (!transformer || cursor.type !== CursorType.Transform) return null
  return (
    <div
      ref={ref}
      className={prefix}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
        zIndex: 4,
        display: 'none',
      }}
    >
      <div className={innerPrefix}></div>
      <RotateHandler />
      <ResizeHandler />
    </div>
  )
})

TransformBox.displayName = 'TransformBox'
