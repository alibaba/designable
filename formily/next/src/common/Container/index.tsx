import React from 'react'
import { observer } from '@formily/reactive-react'
import { useNodeIdProps, useTreeNode, DroppableWidget } from '@designable/react'
import './styles.less'

interface IContainerProps {
  children?: React.ReactNode
}

export const Container: React.FC<IContainerProps> = observer(({ children }) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  if (node.children.length === 0) return <DroppableWidget {...nodeId} />
  return <div {...nodeId}>{children}</div>
})

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return (props: any) => {
    return (
      <DroppableWidget>
        <Target {...props} />
      </DroppableWidget>
    )
  }
}
