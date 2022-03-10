import React from 'react'
import { usePrefix } from '../hooks'

export interface IWorkspaceItemProps {
  style?: React.CSSProperties
  flexable?: boolean
}

export const WorkspacePanel: React.FC<IWorkspaceItemProps> & {
  Item?: React.FC<IWorkspaceItemProps>
} = (props) => {
  const prefix = usePrefix('workspace-panel')
  return (
    <div
      className={prefix}
      {...props}
      style={
        props.flexable
          ? props.style
            ? { ...props.style }
            : { flexGrow: 1 }
          : {}
      }
    >
      {props.children}
    </div>
  )
}

WorkspacePanel.Item = (props) => {
  const prefix = usePrefix('workspace-panel-item')
  return (
    <div
      className={prefix}
      style={{
        ...props.style,
        flexGrow: 1,
        flexShrink: props.flexable ? 1 : 0,
      }}
    >
      {props.children}
    </div>
  )
}
