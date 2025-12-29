import React from 'react'
import { Rate as AntdRate } from 'antd'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field/shared.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const Rate: React.FC<React.ComponentProps<typeof AntdRate>> = AntdRate

;(Rate as any).Behavior = createBehavior({
  name: 'Rate',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Rate',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Rate),
  },
  designerLocales: AllLocales.Rate,
})

;(Rate as any).Resource = createResource({
  icon: 'RateSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'number',
        title: 'Rate',
        'x-decorator': 'FormItem',
        'x-component': 'Rate',
      },
    },
  ],
})
