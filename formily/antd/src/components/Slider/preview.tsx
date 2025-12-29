import React from 'react'
import { Slider as AntdSlider } from 'antd'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field/shared.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const Slider: React.FC<React.ComponentProps<typeof AntdSlider>> = AntdSlider

;(Slider as any).Behavior = createBehavior({
  name: 'Slider',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Slider',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Slider),
  },
  designerLocales: AllLocales.Slider,
})

;(Slider as any).Resource = createResource({
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
