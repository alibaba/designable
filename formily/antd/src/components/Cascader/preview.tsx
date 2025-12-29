import React from 'react'
import { Cascader as FormilyCascader } from '@formily/antd-v5'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field/shared.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const Cascader: React.FC<React.ComponentProps<typeof FormilyCascader>> =
  FormilyCascader

;(Cascader as any).Behavior = createBehavior({
  name: 'Cascader',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Cascader',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Cascader),
  },
  designerLocales: AllLocales.Cascader,
})

;(Cascader as any).Resource = createResource({
  icon: 'CascaderSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Cascader',
        'x-decorator': 'FormItem',
        'x-component': 'Cascader',
      },
    },
  ],
})
