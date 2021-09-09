import React, { Fragment } from 'react'
import { observer } from '@formily/reactive-react'
import { TreeNode } from '@designable/core'
export interface INodeTitleWidgetProps {
  node: TreeNode
}

export const NodeTitleWidget: React.FC<INodeTitleWidgetProps> = observer(
  (props) => {
    const takeNode = () => {
      const node = props.node
      if (node.componentName === '$$ResourceNode$$') {
        return node.children[0]
      }
      return node
    }
    const node = takeNode()
    return <Fragment>{node.getMessage('title') || node.componentName}</Fragment>
  }
)
