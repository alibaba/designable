import React from 'react'
import { Password as FormilyPassword } from '@formily/antd'
import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Password: DnFC<React.ComponentProps<typeof FormilyPassword>> =
  FormilyPassword

Password.Feature = createFeature({
  name: 'Password',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Password',
  descriptor: {
    propsSchema: createFieldSchema(AllSchemas.Password),
  },
  locales: AllLocales.Password,
})

Password.Resource = createResource({
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
