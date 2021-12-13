import React from 'react'
import { TreeSelect as FormilyTreeSelect } from '@formily/antd'
import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const TreeSelect: DnFC<React.ComponentProps<typeof FormilyTreeSelect>> =
  FormilyTreeSelect

TreeSelect.Feature = createFeature({
  name: 'TreeSelect',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'TreeSelect',
  descriptor: {
    propsSchema: createFieldSchema(AllSchemas.TreeSelect),
  },
  locales: AllLocales.TreeSelect,
})

TreeSelect.Resource = createResource({
  icon: 'TreeSelectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'TreeSelect',
        'x-decorator': 'FormItem',
        'x-component': 'TreeSelect',
      },
    },
  ],
})
