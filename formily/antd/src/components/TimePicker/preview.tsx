import React from 'react'
import { TimePicker as FormilyTimePicker } from '@formily/antd-v5'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field/shared.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const TimePicker: React.FC<React.ComponentProps<typeof FormilyTimePicker>> =
  FormilyTimePicker

;(TimePicker as any).Behavior = createBehavior(
  {
    name: 'TimePicker',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'TimePicker',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TimePicker),
    },
    designerLocales: AllLocales.TimePicker,
  },
  {
    name: 'TimePicker.RangePicker',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'TimePicker.RangePicker',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TimePicker.RangePicker),
    },
    designerLocales: AllLocales.TimeRangePicker,
  }
)

;(TimePicker as any).Resource = createResource(
  {
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
  },
  {
    icon: 'TimeRangePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string[]',
          title: 'TimeRangePicker',
          'x-decorator': 'FormItem',
          'x-component': 'TimePicker.RangePicker',
        },
      },
    ],
  }
)
