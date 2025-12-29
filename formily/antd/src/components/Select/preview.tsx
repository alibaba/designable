import React from 'react'
import { Select as FormilySelect } from '@formily/antd-v5'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field/shared.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const Select: React.FC<React.ComponentProps<typeof FormilySelect>> =
  FormilySelect

;(Select as any).Behavior = createBehavior({
  name: 'Select',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Select',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Select),
  },
  designerLocales: AllLocales.Select,
})

;(Select as any).Resource = createResource({
  icon: 'SelectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Select',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
    },
  ],
})
