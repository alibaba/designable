import React from 'react'
import { TreeNode } from '@designable/core'
import { TextWidget } from '../TextWidget'
export interface INodeTitleWidgetProps {
  node: TreeNode
}

export const NodeTitleWidget: React.FC<INodeTitleWidgetProps> = (props) => {
  return (
    <TextWidget
      sourceName={props.node.sourceName}
      componentName={props.node.componentName}
      token="title"
      defaultMessage={props.node.componentName || 'NoComponentTitle'}
    >
      {props.node.designerProps.title}
    </TextWidget>
  )
}
