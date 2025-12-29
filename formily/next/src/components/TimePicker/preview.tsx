import React from 'react'
import { TimePicker as FormilyTimePicker } from '@formily/next'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const TimePicker: React.FC<React.ComponentProps<typeof FormilyTimePicker>> =
  FormilyTimePicker

;(TimePicker as any).Behavior = createBehavior({
  name: 'TimePicker',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'TimePicker',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.TimePicker),
  },
  designerLocales: AllLocales.TimePicker,
})

;(TimePicker as any).Resource = createResource({
  icon: 'TimePickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'TimePicker',
        'x-decorator': 'FormItem',
        'x-component': 'TimePicker',
      },
    },
  ],
})
