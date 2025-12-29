import React from 'react'
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer'
import { TreeNode, ITreeNode } from '@designable/core'
import { MonacoInput } from '@designable/react-settings-form'

import '@designable/react-settings-form/style'

export interface ISchemaEditorWidgetProps {
  tree: TreeNode
  onChange?: (tree: ITreeNode) => void
}

export const SchemaEditorWidget: React.FC<ISchemaEditorWidgetProps> = (
  props
) => {
  console.log('SchemaEditorWidget props.tree', props.tree)
  const schema = transformToSchema(props.tree)
  console.log('SchemaEditorWidget props', props)

  return (
    <MonacoInput
      {...props}
      value={JSON.stringify(schema, null, 2)}
      onChange={(value) => {
        const schema = JSON.parse(value)
        const tree = transformToTreeNode(schema)
        // props.tree.replaceWith(tree)
        props.onChange?.(tree)
      }}
      language="json"
    />
  )
}
