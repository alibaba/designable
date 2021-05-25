import { TreeNode } from '@designable/core'
import React, { createContext } from 'react'

interface INodeContext {
  renderTitle?: (node: TreeNode) => React.ReactNode
  renderActions?: (node: TreeNode) => React.ReactNode
}

export const NodeContext = createContext<INodeContext>(null)
