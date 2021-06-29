import { SchemaComponents } from '@formily/react'
import React from 'react'

export interface ISettingFormProps<Components extends SchemaComponents = any> {
  className?: string
  style?: React.CSSProperties
  uploadAction?: string
  extraComponents?: Components
}
