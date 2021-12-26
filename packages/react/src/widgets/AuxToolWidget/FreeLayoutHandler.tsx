import React from 'react'
import cls from 'classnames'
import { useDesigner, usePrefix } from '../../hooks'
import { TreeNode } from '@designable/core'

export interface IFreeLayoutHandlerProps {
  node: TreeNode
}

export const FreeLayoutHandler: React.FC<IFreeLayoutHandlerProps> = (props) => {
  const designer = useDesigner()
  const prefix = usePrefix('aux-node-free-layout-handler')
  const createHandler = (value: string) => {
    return {
      [designer.props.nodeFreeLayoutAttrName]: value,
      className: cls(prefix, value),
    }
  }
  const allowFreeLayout = props.node.allowFreeLayout()
  if (!allowFreeLayout) return null
  return (
    <>
      <div {...createHandler('free')}>Free</div>
    </>
  )
}
