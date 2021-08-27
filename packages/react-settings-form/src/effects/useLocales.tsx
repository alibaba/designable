import React from 'react'
import { isVoidField, onFieldReact } from '@formily/core'
import { GlobalRegistry, TreeNode } from '@designable/core'
import { isPlainObj, isStr } from '@designable/shared'
import { IconWidget } from '@designable/react'

const takeMessage = (message: any): any => {
  if (isStr(message))
    return {
      title: message,
    }
  if (isPlainObj(message)) return message
  return {}
}

const takeIcon = (message: string) => {
  if (!isStr(message)) return
  const matched = message.match(/@([^:\s]+)(?:\s*\:\s*([\s\S]+))?/)
  if (matched) return [matched[1], matched[2]]
  return
}

export const useLocales = (node: TreeNode) => {
  onFieldReact('*', (field) => {
    const takeLocales = () => {
      const namespace = node?.designerProps?.propsSchema?.$namespace
      const componentName = node?.componentName
      const sourceName = node?.sourceName
      const path = field.path.toString().replace(/\.[\d+]/g, '')
      const token = field.path.segments[field.path.segments.length - 1]
      const commonMessage = GlobalRegistry.getDesignerMessage(
        `settings.${path}`
      )
      const sourceMessage = GlobalRegistry.getSourceDesignerMessage(
        sourceName,
        `settings.${path}`
      )
      const componentMessage = GlobalRegistry.getSourceDesignerMessage(
        componentName,
        `settings.${path}`
      )
      const namespaceMessage = GlobalRegistry.getDesignerMessage(
        `settings.${namespace}.${token}`
      )
      if (sourceMessage) return takeMessage(sourceMessage)
      if (componentMessage) return takeMessage(componentMessage)
      if (namespaceMessage) return takeMessage(namespaceMessage)
      return takeMessage(commonMessage)
    }
    const locales = takeLocales()
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
        if (field.dataSource?.length) {
          field.dataSource = field.dataSource.map((item, index) => {
            const label =
              locales.dataSource[index] ||
              locales.dataSource[item.value] ||
              item.label
            const icon = takeIcon(label)
            return {
              ...item,
              value: item?.value ?? null,
              label: icon ? (
                <IconWidget infer={icon[0]} tooltip={icon[1]} />
              ) : (
                label?.label ?? label
              ),
            }
          })
        } else {
          field.dataSource = locales.dataSource.slice()
        }
      }
    }
  })
}
