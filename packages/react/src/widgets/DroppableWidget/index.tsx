import React from 'react'
import { TreeNode } from '@sulesky/next-core'
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
  children?: React.ReactNode
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
  }) => {
    const currentNode = useTreeNode()
    const nodeId = useNodeIdProps(node)
    const target = node ?? currentNode
    const hasChildren = hasChildrenProp ?? target.children?.length > 0
    return (
      <div {...nodeId} className={className} style={style}>
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
            {actions.map((action, key) => (
              <NodeActionsWidget.Action {...action} key={key} />
            ))}
          </NodeActionsWidget>
        ) : null}
      </div>
    )
  },
)
