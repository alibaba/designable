import React from 'react'
import { Rate as AntdRate } from 'antd'
import { createMetadata, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Rate: DnFC<React.ComponentProps<typeof AntdRate>> = AntdRate

Rate.Metadata = createMetadata({
  name: 'Rate',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Rate',
  behavior: {
    propsSchema: createFieldSchema(AllSchemas.Rate),
  },
  locales: AllLocales.Rate,
})

Rate.Resource = createResource({
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
