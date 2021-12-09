import React from 'react'
import { Radio as FormilyRadio } from '@formily/next'
import { createMetadata, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Radio: DnFC<React.ComponentProps<typeof FormilyRadio>> =
  FormilyRadio

Radio.Metadata = createMetadata({
  name: 'Radio.Group',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Radio.Group',
  behavior: {
    propsSchema: createFieldSchema(AllSchemas.Radio.Group),
  },
  locales: AllLocales.RadioGroup,
})

Radio.Resource = createResource({
  icon: 'RadioGroupSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string | number',
        title: 'Radio Group',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        enum: [
          { label: '选项1', value: 1 },
          { label: '选项2', value: 2 },
        ],
      },
    },
  ],
})
