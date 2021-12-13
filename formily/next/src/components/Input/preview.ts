import React from 'react'
import { Input as FormilyInput } from '@formily/next'
import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Input: DnFC<React.ComponentProps<typeof FormilyInput>> =
  FormilyInput

Input.Feature = createFeature(
  {
    name: 'Input',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Input',
    descriptor: {
      propsSchema: createFieldSchema(AllSchemas.Input),
    },
    locales: AllLocales.Input,
  },
  {
    name: 'Input.TextArea',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Input.TextArea',
    descriptor: {
      propsSchema: createFieldSchema(AllSchemas.Input.TextArea),
    },
    locales: AllLocales.TextArea,
  }
)

Input.Resource = createResource(
  {
    icon: 'InputSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'Input',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    ],
  },
  {
    icon: 'TextAreaSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'TextArea',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
        },
      },
    ],
  }
)
