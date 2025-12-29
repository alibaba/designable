import React from 'react'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field/shared.js'
import { Container } from '../../common/Container/index.js'
import { AllLocales } from '../../locales/index.js'

export const ObjectContainer: React.FC<React.ComponentProps<typeof Container>> =
  Container
;(ObjectContainer as any).Behavior = createBehavior({
  name: 'Object',
  extends: ['Field'],
  selector: (node) => node.props?.type === 'object',
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(),
  },
  designerLocales: AllLocales.ObjectLocale,
})

;(ObjectContainer as any).Resource = createResource({
  icon: 'ObjectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
      },
    },
  ],
})
