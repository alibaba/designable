import React from 'react'
import { Content } from './content'
import { renderSandboxContent, useSandboxScope } from '@designable/react-sandbox'
import './designer-setup'

console.log('[sandbox.tsx] Loaded')

renderSandboxContent(() => {
  const { engine, workspace } = useSandboxScope() || {}
  console.log('[sandbox.tsx] renderSandboxContent', { engine, workspace })
  return <Content engine={engine} workspace={workspace} />
})
