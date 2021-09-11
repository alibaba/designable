import React from 'react'
import { observer } from '@formily/reactive-react'
import { useNodeIdProps, useTreeNode, useDesigner } from '@designable/react'
import { Droppable } from '../Droppable'
import './styles.less'

export const Container: React.FC = observer((props) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  if (node.children.length === 0) return <Droppable {...nodeId} />
  return <div {...nodeId}>{props.children}</div>
})

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return (props: any) => {
    const designer = useDesigner()
    delete props[designer.props.nodeIdAttrName]
    return (
      <Container>
        <Target {...props} />
      </Container>
    )
  }
}
