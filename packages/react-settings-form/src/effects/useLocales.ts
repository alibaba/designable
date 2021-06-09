import { isVoidField, onFieldReact } from '@formily/core'
import { GlobalRegistry } from '@designable/core'
import { isPlainObj, isStr } from '@designable/shared'

const takeLocales = (token: string): any => {
  const message = GlobalRegistry.getDesignerMessage(token)
  if (isStr(message))
    return {
      title: message,
    }
  if (isPlainObj(message)) return message
  return {}
}

export const useLocales = () => {
  onFieldReact('*', (field) => {
    const token = field.path.toString().replace(/\.[\d+]/g, '')
    const locales = takeLocales(`settings.${token}`)
    if (locales.title) {
      field.title = locales.title
    }
    if (locales.description) {
      field.description = locales.description
    }
    if (locales.tooltip) {
      field.decorator[1] = field.decorator[1] || []
      field.decorator[1].tooltip = locales.tooltip
    }
    if (locales.placeholder) {
      field.component[1] = field.component[1] || []
      field.component[1].placeholder = locales.placeholder
    }
    if (!isVoidField(field)) {
      if (locales.dataSource?.length) {
        field.dataSource = field.dataSource.map((item, index) => {
          return {
            ...item,
            label: locales.dataSource[index] || item.label,
          }
        })
      }
    }
  })
}
