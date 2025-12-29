import React from 'react'
import { WorkspacePanel, IWorkspaceItemProps } from './WorkspacePanel'
import { Simulator } from '../containers'
export const ViewportPanel: React.FC<IWorkspaceItemProps> = (props) => {
  const Item = WorkspacePanel.Item
  if (!Item) return null
  return (
    <Item {...props} flexable>
      <Simulator>{props.children}</Simulator>
    </Item>
  )
}
