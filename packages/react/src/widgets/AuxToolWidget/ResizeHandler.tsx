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
      className: cls(prefix, value),
    }
  }
  const allowResize = props.node.allowResize()
  if (!allowResize) return null
  const allowX = allowResize.includes('x')
  const allowY = allowResize.includes('y')
  return (
    <>
      {allowX && <div {...createHandler('left-center')}></div>}
      {allowX && <div {...createHandler('right-center')}></div>}
      {allowY && <div {...createHandler('center-top')}></div>}
      {allowY && <div {...createHandler('center-bottom')}></div>}
      {allowX && allowY && <div {...createHandler('left-top')}></div>}
      {allowY && allowY && <div {...createHandler('right-top')}></div>}
      {allowX && allowY && <div {...createHandler('left-bottom')}></div>}
      {allowY && allowY && <div {...createHandler('right-bottom')}></div>}
    </>
  )
}
