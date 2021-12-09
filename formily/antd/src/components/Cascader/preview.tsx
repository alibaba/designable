import React from 'react'
import { Cascader as FormilyCascader } from '@formily/antd'
import { createMetadata, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Cascader: DnFC<React.ComponentProps<typeof FormilyCascader>> =
  FormilyCascader

Cascader.Metadata = createMetadata({
  name: 'Cascader',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Cascader',
  behavior: {
    propsSchema: createFieldSchema(AllSchemas.Cascader),
  },
  locales: AllLocales.Cascader,
})

Cascader.Resource = createResource({
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
