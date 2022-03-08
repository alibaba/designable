import { Engine } from '@inbiz/core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@inbiz/shared'
import { message } from 'antd'


const getAllTree = (workbench) => {
  const schema = {}
  workbench.eachWorkspace((workspace) => {
    schema[workspace.id] = transformToSchema(workspace.operation.tree);
  })

  return schema
}

const setAllTree = (workbench) => {
  const schema = JSON.parse(localStorage.getItem('formily-schema'))
  debugger
  workbench.eachWorkspace((workspace) => {
    workspace.operation.tree.from(transformToTreeNode(schema[workspace.id]))
  })
}

export const saveSchema = (designer: Engine) => {

  localStorage.setItem(
    'formily-schema',
    JSON.stringify(getAllTree(designer.workbench))
  )
  message.success('Save Success')
}

export const loadInitialSchema = (designer: Engine) => {
  try {
    setAllTree(designer.workbench)
  } catch { }
}
