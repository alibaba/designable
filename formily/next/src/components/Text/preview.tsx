import React from 'react'
import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import cls from 'classnames'
import './styles.less'

export interface IDesignableTextProps {
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
  style?: React.CSSProperties
  className?: string
}

export const Text: DnFC<IDesignableTextProps> = (props) => {
  const tagName = props.mode === 'normal' || !props.mode ? 'div' : props.mode
  return React.createElement(
    tagName,
    {
      ...props,
      className: cls(props.className, 'dn-text'),
      'data-content-editable': 'x-component-props.content',
    },
    props.content
  )
}

Text.Feature = createFeature({
  name: 'Text',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Text',
  descriptor: {
    propsSchema: createVoidFieldSchema(AllSchemas.Text),
  },
  locales: AllLocales.Text,
})

Text.Resource = createResource({
  icon: 'TextSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        'x-component': 'Text',
      },
    },
  ],
})
