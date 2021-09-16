import React from 'react'
import { Switch as NextSwitch } from '@alifd/next'
import { createBehavior, createResource } from '@designable/core'
import { DnComponent } from '@designable/react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Switch: DnComponent<React.ComponentProps<typeof NextSwitch>> =
  NextSwitch

Switch.Behavior = createBehavior({
  name: 'Switch',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Switch',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Switch),
  },
  designerLocales: AllLocales.Switch,
})

Switch.Resource = createResource({
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
