import { ISchema, Schema } from '@formily/json-schema'
import { ITreeNode, TreeNode } from '@designable/core'
import { clone } from '@designable/shared'

export interface ITranformerOptions {
  designableFieldName?: string
  designableFormName?: string
  schemaFieldName?: string
  schemaFormName?: string
}

export interface IFormilySchema {
  schema?: ISchema
  form?: Record<string, any>
}

const createOptions = (options: ITranformerOptions): ITranformerOptions => {
  return {
    designableFieldName: 'DesignableField',
    designableFormName: 'DesignableForm',
    ...options,
  }
}

export const transformToSchema = (
  node: TreeNode,
  options?: ITranformerOptions
): IFormilySchema => {
  const realOptions = createOptions(options)
  const root = node.find((child) => {
    return child.componentName === realOptions.designableFormName
  })
  const schema = {
    type: 'object',
    properties: {},
  }
  if (!root) return { schema }
  const createSchema = (node: TreeNode, schema: ISchema = {}) => {
    Object.assign(schema, clone(node.props))
    schema._designableId = node.id
    if (schema.type === 'array') {
      if (node.children[0]) {
        if (
          node.children[0].componentName === realOptions.designableFieldName
        ) {
          schema.items = createSchema(node.children[0])
          schema['x-index'] = 0
        }
      }
      node.children.slice(1).forEach((child, index) => {
        if (child.componentName !== realOptions.designableFieldName) return
        const key = child.props.name || child.id
        schema.properties = schema.properties || {}
        schema.properties[key] = createSchema(child)
        schema.properties[key]['x-index'] = index
      })
    } else {
      node.children.forEach((child, index) => {
        if (child.componentName !== realOptions.designableFieldName) return
        const key = child.props.name || child.id
        schema.properties = schema.properties || {}
        schema.properties[key] = createSchema(child)
        schema.properties[key]['x-index'] = index
      })
    }
    return schema
  }
  return { form: clone(root.props), schema: createSchema(root, schema) }
}

export const transformToTreeNode = (
  formily: IFormilySchema = {},
  options?: ITranformerOptions
) => {
  const realOptions = createOptions(options)
  const root: ITreeNode = {
    componentName: realOptions.designableFormName,
    props: formily.form,
    children: [],
  }
  const schema = new Schema(formily.schema)
  const appendTreeNode = (parent: ITreeNode, schema: Schema) => {
    if (!schema) return
    const current = {
      id: schema['_designableId'],
      componentName: realOptions.designableFieldName,
      props: schema.toJSON(false),
      children: [],
    }
    parent.children.push(current)
    if (schema.items && !Array.isArray(schema.items)) {
      appendTreeNode(current, schema.items)
    }
    schema.mapProperties((schema, key) => {
      schema['_designableId'] = schema['_designableId'] || key
      appendTreeNode(current, schema)
    })
  }
  schema.mapProperties((schema, key) => {
    schema['_designableId'] = schema['_designableId'] || key
    appendTreeNode(root, schema)
  })
  return root
}
