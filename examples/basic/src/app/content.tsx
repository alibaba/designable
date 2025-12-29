import React from 'react'
import { ComponentTreeWidget } from '@designable/react'

import { components } from './setup'

export const Content = () => {
  return (
  <ComponentTreeWidget
      components={components}
  />
)
}
