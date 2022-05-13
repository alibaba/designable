import React from 'react'
import { useDesigner, usePrefix } from '../../hooks'
import { TreeNode } from '@designable/core'

export interface IRotateHandlerProps {
  node: TreeNode
}

export const RotateHandler: React.FC<IRotateHandlerProps> = (props) => {
  const designer = useDesigner()
  const prefix = usePrefix('aux-node-rotate-handler')
  const allowRotate = props.node.allowRotate()
  if (!allowRotate) return null
  return (
    <div className={prefix}>
      <div
        className={prefix + '-head'}
        {...{ [designer.props.nodeRotateHandlerAttrName]: true }}
      ></div>
    </div>
  )
}
