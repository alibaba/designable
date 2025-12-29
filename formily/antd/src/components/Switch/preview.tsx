import React from 'react'
import { Switch as AntdSwitch } from 'antd'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field/shared.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const Switch: React.FC<React.ComponentProps<typeof AntdSwitch>> = AntdSwitch

;(Switch as any).Behavior = createBehavior({
  name: 'Switch',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Switch',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Switch),
  },
  designerLocales: AllLocales.Switch,
})

;(Switch as any).Resource = createResource({
  icon: 'SwitchSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'boolean',
        title: 'Switch',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
      },
    },
  ],
})
