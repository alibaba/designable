import React from 'react'
import { Card as AntdCard } from 'antd'

import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Card: DnFC<React.ComponentProps<typeof AntdCard>> = (props) => {
  return (
    <AntdCard
      {...props}
      title={
        <span data-content-editable="x-component-props.title">
          {props.title}
        </span>
      }
    >
      {props.children}
    </AntdCard>
  )
}

Card.Feature = createFeature({
  name: 'Card',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Card',
  descriptor: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Card),
  },
  locales: AllLocales.Card,
})

Card.Resource = createResource({
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          title: 'Title',
        },
      },
    },
  ],
})
