import React from 'react'
import { TreeNode } from '@designable/core'
import { observer } from '@formily/reactive-react'
import { useTreeNode, useNodeIdProps } from '../../hooks'
import { NodeTitleWidget } from '../NodeTitleWidget'
import './styles.less'

export interface IDroppableWidgetProps {
  node?: TreeNode
}

export const DroppableWidget: React.FC<IDroppableWidgetProps> = observer(
  (props) => {
    const currentNode = useTreeNode()
    const nodeId = useNodeIdProps(props.node)
    const target = props.node ?? currentNode
    const hasChildren = target.children?.length > 0
    return (
      <div {...nodeId} className={hasChildren ? '' : 'dn-droppable'}>
        {hasChildren ? props.children : <NodeTitleWidget node={target} />}
      </div>
    )
  }
)
