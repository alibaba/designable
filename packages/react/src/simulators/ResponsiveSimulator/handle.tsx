import React from 'react'
import { useDesigner, usePrefix } from '../../hooks'
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
  const designer = useDesigner()
  return (
    <div
      {...props}
      {...{ [designer.props.screenResizeHandlerAttrName]: props.type }}
      className={cls(prefix, {
        [`${prefix}-${props.type}`]: !!props.type,
      })}
    >
      {props.children}
    </div>
  )
}
