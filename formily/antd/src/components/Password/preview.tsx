import React from 'react'
import { Password as FormilyPassword } from '@formily/antd-v5'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field/shared.js'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'

export const Password: React.FC<React.ComponentProps<typeof FormilyPassword>> =
  FormilyPassword

;(Password as any).Behavior = createBehavior({
  name: 'Password',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Password',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Password),
  },
  designerLocales: AllLocales.Password,
})

;(Password as any).Resource = createResource({
  icon: 'PasswordSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Password',
        'x-decorator': 'FormItem',
        'x-component': 'Password',
      },
    },
  ],
})
