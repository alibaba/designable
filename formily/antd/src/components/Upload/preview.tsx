import React from 'react'
import { Upload as FormilyUpload } from '@formily/antd'
import { createFeature, createResource } from '@designable/core'
import { DnFC } from '@designable/react-page'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Upload: DnFC<React.ComponentProps<typeof FormilyUpload>> =
  FormilyUpload

Upload.Feature = createFeature(
  {
    name: 'Upload',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Upload',
    descriptor: {
      propsSchema: createFieldSchema(AllSchemas.Upload),
    },
    locales: AllLocales.Upload,
  },
  {
    name: 'Upload.Dragger',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Upload.Dragger',
    descriptor: {
      propsSchema: createFieldSchema(AllSchemas.Upload.Dragger),
    },
    locales: AllLocales.UploadDragger,
  }
)

Upload.Resource = createResource(
  {
    icon: 'UploadSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'Array<object>',
          title: 'Upload',
          'x-decorator': 'FormItem',
          'x-component': 'Upload',
          'x-component-props': {
            textContent: 'Upload',
          },
        },
      },
    ],
  },
  {
    icon: 'UploadDraggerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'Array<object>',
          title: 'Drag Upload',
          'x-decorator': 'FormItem',
          'x-component': 'Upload.Dragger',
          'x-component-props': {
            textContent: 'Click or drag file to this area to upload',
          },
        },
      },
    ],
  }
)
