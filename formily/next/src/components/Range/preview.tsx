import React from 'react'
import { Range as NextRange } from '@alifd/next'
import { createFeature, createResource } from '@designable/core'
import { DnComponent } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Range: DnComponent<React.ComponentProps<typeof NextRange>> =
  NextRange

Range.Feature = createFeature({
  name: 'Range',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Range',
  descriptor: {
    propsSchema: createFieldSchema(AllSchemas.Range),
  },
  locales: AllLocales.Range,
})

Range.Resource = createResource({
  icon: 'SliderSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'number',
        title: 'Range',
        'x-decorator': 'FormItem',
        'x-component': 'Range',
      },
    },
  ],
})
