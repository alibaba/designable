import React from 'react'
import { useCursor, usePrefix, useDesigner } from '../../hooks'
import { CursorStatus } from '@designable/core'
import { observer } from '@formily/reactive-react'
import { TextWidget } from '../TextWidget'
import './styles.less'

export const GhostWidget = observer(() => {
  const designer = useDesigner()
  const cursor = useCursor()
  const prefix = usePrefix('ghost')
  const draggingNodes = designer.findDraggingNodes()
  const firstNode = draggingNodes[0]
  const renderNodes = () => {
    return (
      <span
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        <TextWidget>
          {firstNode?.designerProps?.title ||
            firstNode?.componentName ||
            'NoTitleComponent'}
        </TextWidget>
        {draggingNodes.length > 1 ? '...' : ''}
      </span>
    )
  }
  if (!firstNode) return null
  return cursor.status === CursorStatus.Dragging ? (
    <div
      className={prefix}
      style={{
        transform: `perspective(1px) translate3d(${
          cursor.position?.topClientX - 18
        }px,${cursor.position?.topClientY - 12}px,0) scale(0.8)`,
      }}
    >
      {renderNodes()}
    </div>
  ) : null
})

GhostWidget.displayName = 'GhostWidget'
