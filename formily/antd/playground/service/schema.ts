import { Engine } from '@designable/core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer'
import { message } from 'antd'

import { ISchema } from '@formily/json-schema'


export const saveSchema = (designer: Engine) => {
  const tree = designer.getCurrentTree()

  if (!tree) return

  const data = transformToSchema(tree, {
    designableFormName: 'Form',
  })


  console.log('saveSchema: Schema JSON:', data.schema)
  console.log('saveSchema: Form Props:', data.form)

  localStorage.setItem(
    'formily-schema',
    JSON.stringify(data)
  )
  message.success('Save Success')
}

export const loadInitialSchema = (designer: Engine) => {
  try {
    const data = localStorage.getItem('formily-schema')
    const parsed = JSON.parse(data)
    const tree = transformToTreeNode(parsed)
    designer.setCurrentTree(
      tree
    )
  } catch {
    console.warn('No initial schema found')
  }
}

