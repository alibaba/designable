import React from 'react'
import { DatePicker as FormilyDatePicker } from '@formily/next'
import { createMetadata, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const DatePicker: DnFC<React.ComponentProps<typeof FormilyDatePicker>> =
  FormilyDatePicker

DatePicker.Metadata = createMetadata(
  {
    name: 'DatePicker',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'DatePicker',
    behavior: {
      propsSchema: createFieldSchema(AllSchemas.DatePicker),
    },
    locales: AllLocales.DatePicker,
  },
  {
    name: 'DatePicker.RangePicker',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'DatePicker.RangePicker',
    behavior: {
      propsSchema: createFieldSchema(AllSchemas.DatePicker.RangePicker),
    },
    locales: AllLocales.DateRangePicker,
  }
)

DatePicker.Resource = createResource(
  {
    icon: 'DatePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'DatePicker',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
        },
      },
    ],
  },
  {
    icon: 'DateRangePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string[]',
          title: 'DateRangePicker',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker.RangePicker',
        },
      },
    ],
  }
)
