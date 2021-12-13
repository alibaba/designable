import React from 'react'
import { Switch as NextSwitch } from '@alifd/next'
import { createFeature, createResource } from '@designable/core'
import { DnComponent } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Switch: DnComponent<React.ComponentProps<typeof NextSwitch>> =
  NextSwitch

Switch.Feature = createFeature({
  name: 'Switch',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Switch',
  descriptor: {
    propsSchema: createFieldSchema(AllSchemas.Switch),
  },
  locales: AllLocales.Switch,
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
