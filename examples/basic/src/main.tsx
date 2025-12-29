import React from 'react'
import { createRoot } from 'react-dom/client'

// Suppress Ant Design React 19 compatibility warning
const originalConsoleWarn = console.warn
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('antd v5 support React is 16 ~ 18')
  ) {
    return
  }
  originalConsoleWarn.apply(console, args)
}


import { App } from './app/App'


const root = createRoot(document.getElementById('root')!)
root.render(<App />)
