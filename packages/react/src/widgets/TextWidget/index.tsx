import React, { Fragment } from 'react'
import { isStr } from '@designable/shared'
import { GlobalRegistry } from '@designable/core'
import { observer } from '@formily/reactive-react'

export interface ITextWidgetProps {
  componentName?: string
  sourceName?: string
  token?: string
  defaultMessage?: string
}

export const TextWidget: React.FC<ITextWidgetProps> = observer((props) => {
  const takeToken = () => {
    if (isStr(props.children)) return props.children || props.token
  }
  const takeMessage = (token: string) => {
    if (!token) return
    if (props.componentName) {
      const message = GlobalRegistry.getComponentDesignerMessage(
        props.componentName,
        token
      )
      if (message) return message
    }
    const message = GlobalRegistry.getDesignerMessage(token)
    if (message) return message
  }
  const token = takeToken()
  const message =
    takeMessage(token) || takeMessage(props.token) || props.defaultMessage
  if (message) return message
  return <Fragment>{props.children}</Fragment>
})
