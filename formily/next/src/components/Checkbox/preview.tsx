import React from 'react'
import { Checkbox as FormilyCheckbox } from '@formily/next'
import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Checkbox: DnFC<React.ComponentProps<typeof FormilyCheckbox>> =
  FormilyCheckbox

Checkbox.Feature = createFeature({
  name: 'Checkbox.Group',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Checkbox.Group',
  descriptor: {
    propsSchema: createFieldSchema(AllSchemas.Checkbox.Group),
  },
  locales: AllLocales.CheckboxGroup,
})

Checkbox.Resource = createResource({
  icon: 'CheckboxGroupSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'Array<string | number>',
        title: 'Checkbox Group',
        'x-decorator': 'FormItem',
        'x-component': 'Checkbox.Group',
        enum: [
          { label: '选项1', value: 1 },
          { label: '选项2', value: 2 },
        ],
      },
    },
  ],
})
