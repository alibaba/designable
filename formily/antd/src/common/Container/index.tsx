import React from 'react'
import { observer } from '@formily/reactive-react'
import { DroppableWidget } from '@designable/react'
import './styles.less'

interface IContainerProps {
  children?: React.ReactNode
}

export const Container: React.FC<IContainerProps> = observer(({ children }) => {
  return <DroppableWidget>{children}</DroppableWidget>
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
