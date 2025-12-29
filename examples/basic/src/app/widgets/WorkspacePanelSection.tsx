import React from 'react'
import { WorkspacePanel, ToolbarPanel, DesignerToolsWidget, ViewToolsWidget, ViewportPanel, ViewPanel } from '@designable/react'
import { Content } from '../content'
import { JsonTree } from '../json-tree'
import { Preview } from '../preview'

import {  MonacoInput } from '@designable/react-settings-form'

export const WorkspacePanelSection: React.FC = () => (
  <WorkspacePanel>
    <ToolbarPanel>
      <DesignerToolsWidget />
      <ViewToolsWidget />
    </ToolbarPanel>
    <ViewportPanel>
      <ViewPanel type="DESIGNABLE">{() => <Content />}</ViewPanel>
       <ViewPanel type="JSONTREE">{() => <JsonTree />}</ViewPanel>
    <ViewPanel type="PREVIEW">{() => <Preview />}</ViewPanel>

    </ViewportPanel>
  </WorkspacePanel>
)
