import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

// Suppress Ant Design React 19 compatibility warning - must be before antd imports
if (typeof console !== 'undefined') {
  const originalConsoleWarn = console.warn
  console.warn = function (...args: any[]) {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('antd v5 support React is 16 ~ 18')
    ) {
      return
    }
    originalConsoleWarn.apply(console, args)
  }
}

import {
  Designer,
  IconWidget,
  Workbench,
  ViewPanel,
  DesignerToolsWidget,
  ViewToolsWidget,
  OutlineTreeWidget,
  ResourceWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  SettingsPanel,
  HistoryWidget,
} from '@designable/react'
import { SettingsForm, MonacoInput } from '@designable/react-settings-form'
import { observer } from '@formily/react'
import { Logo } from './components/Logo'
import { Actions } from './components/Actions'
import { CompositePanelSection } from './components/CompositePanelSection'
import { WorkspacePanelSection } from './components/WorkspacePanelSection'
import { SettingsPanelSection } from './components/SettingsPanelSection'

import {
  Input,
  Card,
  RootBehavior,
  InputBehavior,
  CardBehavior,
  engine,
} from './designer-setup'


const App = () => {
  useEffect(() => {
    // App mounted
  }, [])
  return (
    <Designer engine={engine}>
      <Workbench>
        <StudioPanel logo={<Logo />} actions={<Actions />}>
          <CompositePanelSection />
          <WorkspacePanelSection />
          <SettingsPanelSection />
        </StudioPanel>
      </Workbench>
    </Designer>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
