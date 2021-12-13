import React from 'react'
import { Space as FormilySpace } from '@formily/antd'
import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createVoidFieldSchema } from '../Field'
import { withContainer } from '../../common/Container'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Space: DnFC<React.ComponentProps<typeof FormilySpace>> =
  withContainer(FormilySpace)

Space.Feature = createFeature({
  name: 'Space',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Space',
  descriptor: {
    droppable: true,
    inlineChildrenLayout: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Space),
  },
  locales: AllLocales.Space,
})

Space.Resource = createResource({
  icon: 'SpaceSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Space',
      },
    },
  ],
})
