import React from 'react'
import { TreeNode } from '@designable/core'
import { observer } from '@formily/reactive-react'
import { useTreeNode, useNodeIdProps } from '../../hooks'
import { NodeTitleWidget } from '../NodeTitleWidget'
import {
  NodeActionsWidget,
  INodeActionsWidgetActionProps,
} from '../NodeActionsWidget'
import './styles.less'

export interface IDroppableWidgetProps {
  node?: TreeNode
  actions?: INodeActionsWidgetActionProps[]
  placeholder?: boolean
  height?: number
  style?: React.CSSProperties
  className?: string
  hasChildren?: boolean
}

export const DroppableWidget: React.FC<IDroppableWidgetProps> = observer(
  ({
    node,
    actions,
    height,
    placeholder = true,
    style,
    className,
    hasChildren: hasChildrenProp,
    children,
    ...props
  }) => {
    const currentNode = useTreeNode()
    const nodeId = useNodeIdProps(node)
    const target = node ?? currentNode
    if (!target) return null
    const hasChildren = hasChildrenProp ?? target.children?.length > 0
    return (
      <div {...nodeId} {...props} className={className} style={style}>
        {hasChildren ? (
          children
        ) : placeholder ? (
          <div style={{ height }} className="dn-droppable-placeholder">
            <NodeTitleWidget node={target} />
          </div>
        ) : (
          children
        )}
        {actions?.length ? (
          <NodeActionsWidget>
            {actions.map((action, key) => {
              const Action = NodeActionsWidget.Action
              if (!Action) return null
              return <Action {...action} key={key} />
            })}
          </NodeActionsWidget>
        ) : null}
      </div>
    )
  }
)
