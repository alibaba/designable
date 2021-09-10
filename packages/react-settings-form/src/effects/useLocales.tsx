import React from 'react'
import { isVoidField, onFieldReact } from '@formily/core'
import { TreeNode, GlobalRegistry } from '@designable/core'
import { isStr } from '@designable/shared'
import { IconWidget } from '@designable/react'

const takeIcon = (message: string) => {
  if (!isStr(message)) return
  const matched = message.match(/@([^:\s]+)(?:\s*\:\s*([\s\S]+))?/)
  if (matched) return [matched[1], matched[2]]
  return
}

const mapEnum = (dataSource: any[]) => (item: any, index: number) => {
  const label = dataSource[index] || dataSource[item.value] || item.label
  const icon = takeIcon(label)
  return {
    ...item,
    value: item?.value ?? null,
    label: icon ? (
      <IconWidget infer={icon[0]} tooltip={icon[1]} />
    ) : (
      label?.label ?? label ?? 'Unknow'
    ),
  }
}

export const useLocales = (node: TreeNode) => {
  onFieldReact('*', (field) => {
    const path = field.path.toString().replace(/\.[\d+]/g, '')
    const takeMessage = (prop?: string) => {
      const token = `settings.${path}${prop ? `.${prop}` : ''}`
      return node.getMessage(token) || GlobalRegistry.getDesignerMessage(token)
    }
    const title = takeMessage('title') || takeMessage()
    const description = takeMessage('description')
    const tooltip = takeMessage('tooltip')
    const dataSource = takeMessage('dataSource')
    const placeholder = takeMessage('placeholder')
    if (title) {
      field.title = title
    }
    if (description) {
      field.description = description
    }
    if (tooltip) {
      field.decorator[1] = field.decorator[1] || []
      field.decorator[1].tooltip = tooltip
    }
    if (placeholder) {
      field.component[1] = field.component[1] || []
      field.component[1].placeholder = placeholder
    }
    if (!isVoidField(field)) {
      if (dataSource?.length) {
        if (field.dataSource?.length) {
          field.dataSource = field.dataSource.map(mapEnum(dataSource))
        } else {
          field.dataSource = dataSource.slice()
        }
      } else {
        field.dataSource = field.dataSource?.filter(Boolean)
      }
    }
  })
}
