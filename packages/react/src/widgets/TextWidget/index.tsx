import React, { Fragment } from 'react'
import { isStr } from '@designable/shared'
import { GlobalRegistry } from '@designable/core'
import { observer } from '@formily/reactive-react'

export interface ITextWidgetProps {
  token?: string
}

export const TextWidget: React.FC<ITextWidgetProps> = observer((props) => {
  const token = props.token
    ? props.token
    : isStr(props.children)
    ? props.children
    : null
  if (token) {
    const message = GlobalRegistry.getDesignerMessage(token)
    if (message) return message
  }
  return <Fragment>{props.children}</Fragment>
})
