import React from 'react'
import { WorkspacePanel, IWorkspaceItemProps } from './WorkspacePanel'

export const ToolbarPanel: React.FC<IWorkspaceItemProps> = (props) => {
  return (
    <WorkspacePanel.Item
      {...props}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 4,
        padding: '0 4px',
        ...props.style,
      }}
    >
      {props.children}
    </WorkspacePanel.Item>
  )
}
