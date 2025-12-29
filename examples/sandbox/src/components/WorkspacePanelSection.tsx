import React from 'react'
import {
  WorkspacePanel,
  ToolbarPanel,
  DesignerToolsWidget,
  ViewToolsWidget,
  ViewportPanel,
  ViewPanel,
} from '@designable/react'


export const WorkspacePanelSection: React.FC = () => {
  return (
    <WorkspacePanel>
      <ToolbarPanel>
        <DesignerToolsWidget />
        {/* <ViewToolsWidget /> */}
      </ToolbarPanel>
      <ViewportPanel>
        <ViewPanel type="DESIGNABLE">
          {() => (
            <iframe
              src="/sandbox.html"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Sandbox"
            />
          )}
        </ViewPanel>
        <ViewPanel type="JSONTREE">
          {() => {
            return (
              <div style={{ overflow: 'hidden', height: '100%' }}>
                {/* Add JSON tree or code editor here if needed */}
              </div>
            )
          }}
        </ViewPanel>
      </ViewportPanel>
    </WorkspacePanel>
  )
}
