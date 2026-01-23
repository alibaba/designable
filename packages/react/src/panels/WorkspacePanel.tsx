import React from 'react'
import { usePrefix } from '../hooks'

export interface IWorkspacePanelProps {
  children?: React.ReactNode
}

export interface IWorkspaceItemProps {
  style?: React.CSSProperties
  flexable?: boolean
  children?: React.ReactNode
}

export const WorkspacePanel: React.FC<IWorkspacePanelProps> & {
  Item?: React.FC<IWorkspaceItemProps>
} = ({ children }) => {
  const prefix = usePrefix('workspace-panel')
  return <div className={prefix}>{children}</div>
}

WorkspacePanel.Item = ({ style, flexable, children }) => {
  const prefix = usePrefix('workspace-panel-item')
  return (
    <div
      className={prefix}
      style={{
        ...style,
        flexGrow: flexable ? 1 : 0,
        flexShrink: flexable ? 1 : 0,
      }}
    >
      {children}
    </div>
  )
}
