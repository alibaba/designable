import React from 'react'
import { observer } from '@formily/reactive-react'
import { useWorkbench } from '../hooks'
import { Workspace } from './Workspace'

export interface IWorkbenchProps {
  children?: React.ReactNode
}

export const Workbench: React.FC<IWorkbenchProps> = observer(({ children }) => {
  const workbench = useWorkbench()
  return <Workspace id={workbench.currentWorkspace?.id}>{children}</Workspace>
})
