import React from 'react'
import { Content } from './content'
import { renderSandboxContent } from '@sulesky/react-sandbox'
import './theme.less'

renderSandboxContent(() => {
  return <Content />
})
