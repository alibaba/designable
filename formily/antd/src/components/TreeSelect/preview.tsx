import React from 'react'
import { TreeSelect as FormilyTreeSelect } from '@formily/antd-v5'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field/shared.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const TreeSelect: React.FC<React.ComponentProps<typeof FormilyTreeSelect>> =
  FormilyTreeSelect

;(TreeSelect as any).Behavior = createBehavior({
  name: 'TreeSelect',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'TreeSelect',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.TreeSelect),
  },
  designerLocales: AllLocales.TreeSelect,
})

;(TreeSelect as any).Resource = createResource({
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
