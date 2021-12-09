import React from 'react'
import { usePrefix } from '../../hooks'
import cls from 'classnames'
export enum ResizeHandleType {
  Resize = 'RESIZE',
  ResizeWidth = 'RESIZE_WIDTH',
  ResizeHeight = 'RESIZE_HEIGHT',
}

export interface IResizeHandleProps {
  type?: ResizeHandleType
}

export const ResizeHandle: React.FC<IResizeHandleProps> = (props) => {
  const prefix = usePrefix('resize-handle')
  return (
    <div
      {...props}
      data-designer-resize-handle={props.type}
      className={cls(prefix, {
        [`${prefix}-${props.type}`]: !!props.type,
      })}
    >
      {props.children}
    </div>
  )
}
