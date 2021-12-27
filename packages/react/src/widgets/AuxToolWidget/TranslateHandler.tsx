import React from 'react'
import cls from 'classnames'
import { useDesigner, usePrefix } from '../../hooks'
import { TreeNode } from '@designable/core'

export interface ITranslateHandlerProps {
  node: TreeNode
}

export const TranslateHandler: React.FC<ITranslateHandlerProps> = (props) => {
  const designer = useDesigner()
  const prefix = usePrefix('aux-node-free-layout-handler')
  const createHandler = (value: string) => {
    return {
      [designer.props.nodeTranslateAttrName]: value,
      className: cls(prefix, value),
    }
  }
  const allowTranslate = props.node.allowTranslate()
  if (!allowTranslate) return null
  return (
    <>
      <div {...createHandler('free')}>Free</div>
    </>
  )
}
