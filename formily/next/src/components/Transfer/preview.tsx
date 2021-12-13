import React from 'react'
import { Transfer as FormilyTransfer } from '@formily/next'
import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Transfer: DnFC<React.ComponentProps<typeof FormilyTransfer>> =
  FormilyTransfer

Transfer.Feature = createFeature({
  name: 'Transfer',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Transfer',
  descriptor: {
    propsSchema: createFieldSchema(AllSchemas.Transfer),
  },
  locales: AllLocales.Transfer,
})

Transfer.Resource = createResource({
  icon: 'TransferSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Transfer',
        'x-decorator': 'FormItem',
        'x-component': 'Transfer',
      },
    },
  ],
})
