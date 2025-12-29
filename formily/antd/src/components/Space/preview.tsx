import React from 'react'
import { Space as FormilySpace } from '@formily/antd-v5'
import { createBehavior, createResource } from '@designable/core'
import { createVoidFieldSchema } from '../Field/shared.js'
import { withContainer } from '../../common/Container/index.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const Space: React.FC<React.ComponentProps<typeof FormilySpace>> =
  withContainer(FormilySpace)

;(Space as any).Behavior = createBehavior({
  name: 'Space',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Space',
  designerProps: {
    droppable: true,
    inlineChildrenLayout: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Space),
  },
  designerLocales: AllLocales.Space,
})

;(Space as any).Resource = createResource({
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
