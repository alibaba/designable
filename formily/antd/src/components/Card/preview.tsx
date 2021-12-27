import React from 'react'
import { Card as AntdCard } from 'antd'

import { createBehavior, createResource } from '@designable/core'
import { DnFC } from '@designable/react'
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

Card.Behavior = createBehavior({
  name: 'Card',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Card',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Card),
    resizable: {
      width(node, element) {
        const width = Number(
          node.props['x-component-props']?.style?.width ??
            element.getBoundingClientRect().width
        )
        return {
          plus: () => {
            node.props['x-component-props'] =
              node.props['x-component-props'] || {}
            node.props['x-component-props'].style =
              node.props['x-component-props'].style || {}
            node.props['x-component-props'].style.width = width + 6
          },
          minus: () => {
            node.props['x-component-props'] =
              node.props['x-component-props'] || {}
            node.props['x-component-props'].style =
              node.props['x-component-props'].style || {}
            node.props['x-component-props'].style.width = width - 6
          },
        }
      },
    },
    translatable: {
      x(node, element, diffX) {
        const left =
          parseInt(
            node.props['x-component-props']?.style?.left ?? element?.style.left
          ) || 0
        return {
          translate: () => {
            node.props['x-component-props'] =
              node.props['x-component-props'] || {}
            node.props['x-component-props'].style =
              node.props['x-component-props'].style || {}
            node.props['x-component-props'].style.left =
              left + parseInt(String(diffX)) + 'px'
          },
        }
      },
      y(node, element, diffY) {
        const top =
          parseInt(
            node.props['x-component-props']?.style?.top ?? element?.style.top
          ) || 0
        return {
          translate: () => {
            node.props['x-component-props'] =
              node.props['x-component-props'] || {}
            node.props['x-component-props'].style =
              node.props['x-component-props'].style || {}
            node.props['x-component-props'].style.top =
              top + parseInt(String(diffY)) + 'px'
          },
        }
      },
    },
  },
  designerLocales: AllLocales.Card,
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
