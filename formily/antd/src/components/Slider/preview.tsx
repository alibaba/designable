import React from 'react'
import { Slider as AntdSlider } from 'antd'
import { createMetadata, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Slider: DnFC<React.ComponentProps<typeof AntdSlider>> = AntdSlider

Slider.Metadata = createMetadata({
  name: 'Slider',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Slider',
  behavior: {
    propsSchema: createFieldSchema(AllSchemas.Slider),
  },
  locales: AllLocales.Slider,
})

Slider.Resource = createResource({
  icon: 'SliderSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'number',
        title: 'Slider',
        'x-decorator': 'FormItem',
        'x-component': 'Slider',
      },
    },
  ],
})
