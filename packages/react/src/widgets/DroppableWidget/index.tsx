import React from 'react'
import { TreeNode } from '@designable/core'
import { observer } from '@formily/reactive-react'
import { useTreeNode, useNodeIdProps } from '../../hooks'
import { NodeTitleWidget } from '../NodeTitleWidget'
import cls from 'classnames'
import './styles.less'

export interface IDroppableWidgetProps {
  node?: TreeNode
  height?: number
  style?: React.CSSProperties
  className?: string
}

export const DroppableWidget: React.FC<IDroppableWidgetProps> = observer(
  (props) => {
    const currentNode = useTreeNode()
    const nodeId = useNodeIdProps(props.node)
    const target = props.node ?? currentNode
    const hasChildren = target.children?.length > 0
    return (
      <div
        {...nodeId}
        style={{ ...props.style, minHeight: props.height }}
        className={cls(hasChildren ? '' : 'dn-droppable', props.className)}
      >
        {hasChildren ? props.children : <NodeTitleWidget node={target} />}
      </div>
    )
  }
)
