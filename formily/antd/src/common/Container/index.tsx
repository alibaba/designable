import React from 'react'
import { useNodeIdProps, useTreeNode } from '@designable/react'
import { Droppable } from '../Droppable'
import './styles.less'

export const Container: React.FC = (props) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  if (node.children.length === 0) return <Droppable {...nodeId} />
  return <div {...nodeId}>{props.children}</div>
}

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return (props: any) => {
    return (
      <Container>
        <Target {...props} />
      </Container>
    )
  }
}
