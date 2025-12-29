import React from 'react'
import { observer } from '@formily/reactive-react'
import { useNodeIdProps, useTreeNode, DroppableWidget } from '@designable/react'
import './styles.less'

export const Container: React.FC<{ children?: React.ReactNode }> = observer((props) => {
  return React.createElement(DroppableWidget as any, null, props.children)
})

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return (props: any) => {
    return React.createElement(DroppableWidget as any, null, React.createElement(Target, props))
  }
}
