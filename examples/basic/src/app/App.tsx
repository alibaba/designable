import React from 'react'
import { Designer, Workbench, StudioPanel } from '@designable/react'

import { Logo } from './components/Logo'


import { Actions } from './widgets/Actions'
import { CompositePanelSection } from './widgets/CompositePanelSection'
import { WorkspacePanelSection } from './widgets/WorkspacePanelSection'
import { SettingsPanelSection } from './widgets/SettingsPanelSection'

import { engine } from './setup'

export const App = () => {
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
