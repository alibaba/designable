import React, { Fragment } from 'react'
import { isStr, isPlainObj } from '@designable/shared'
import { GlobalRegistry, IDesignerMiniLocales } from '@designable/core'
import { observer } from '@formily/reactive-react'

export interface ITextWidgetProps {
  componentName?: string
  sourceName?: string
  token?: string | IDesignerMiniLocales
  defaultMessage?: string | IDesignerMiniLocales
}

export const TextWidget: React.FC<ITextWidgetProps> = observer((props) => {
  const takeLocale = (
    message: string | IDesignerMiniLocales
  ): React.ReactNode => {
    if (isStr(message)) return message
    if (isPlainObj(message)) {
      const lang = GlobalRegistry.getDesignerLanguage()
      for (let key in message) {
        if (key.toLocaleLowerCase() === lang) return message[key]
      }
      return
    }
    return message
  }
  const takeMessage = (token: any) => {
    if (!token) return
    const message = isStr(token)
      ? GlobalRegistry.getDesignerMessage(token)
      : token
    if (message) return takeLocale(message)
    return token
  }
  return (
    <Fragment>
      {takeMessage(props.children) ||
        takeMessage(props.token) ||
        takeMessage(props.defaultMessage)}
    </Fragment>
  )
})
