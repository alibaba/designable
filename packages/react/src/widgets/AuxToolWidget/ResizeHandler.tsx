import React from 'react'
import cls from 'classnames'
import { useDesigner, usePrefix } from '../../hooks'
import { TreeNode } from '@designable/core'

export interface IResizeHandlerProps {
  node: TreeNode
}

export const ResizeHandler: React.FC<IResizeHandlerProps> = (props) => {
  const designer = useDesigner()
  const prefix = usePrefix('aux-node-resize-handler')
  const createHandler = (value: string) => {
    return {
      [designer.props.nodeResizeHandlerAttrName]: value,
    }
  }
  if (!props.node.allowResize()) return null
  const xPath = props.node.designerProps?.resizeXPath
  const yPath = props.node.designerProps?.resizeYPath
  return (
    <>
      {xPath && (
        <div {...createHandler('x')} className={cls(prefix, 'left')}></div>
      )}
      {xPath && (
        <div {...createHandler('x')} className={cls(prefix, 'right')}></div>
      )}
      {yPath && (
        <div {...createHandler('y')} className={cls(prefix, 'top')}></div>
      )}
      {yPath && (
        <div {...createHandler('y')} className={cls(prefix, 'bottom')}></div>
      )}
    </>
  )
}
