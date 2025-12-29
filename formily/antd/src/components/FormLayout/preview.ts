import React from 'react'
import { FormLayout as FormilyFormLayout } from '@formily/antd-v5'
import { createBehavior, createResource } from '@designable/core'
import { withContainer } from '../../common/Container/index.js'
import { createVoidFieldSchema } from '../Field/shared.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const FormLayout: React.FC<React.ComponentProps<typeof FormilyFormLayout>> =
  withContainer(FormilyFormLayout)

;(FormLayout as any).Behavior = createBehavior({
  name: 'FormLayout',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'FormLayout',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.FormLayout),
  },
  designerLocales: AllLocales.FormLayout,
})

;(FormLayout as any).Resource = createResource({
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormLayout',
      },
    },
  ],
})
