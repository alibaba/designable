import React from 'react'
import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { Container } from '../../common/Container'
import { AllLocales } from '../../locales'

export const ObjectContainer: DnFC<React.ComponentProps<typeof Container>> =
  Container
ObjectContainer.Feature = createFeature({
  name: 'Object',
  extends: ['Field'],
  selector: (node) => node.props.type === 'object',
  descriptor: {
    droppable: true,
    propsSchema: createFieldSchema(),
  },
  locales: AllLocales.ObjectLocale,
})

ObjectContainer.Resource = createResource({
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
