import { useContext } from 'react'
import { useDesigner } from './useDesigner'
import { WorkspaceContext } from '../context'
import { Workspace } from '@designable/core'
import { globalThisPolyfill } from '@designable/shared'

export const useWorkspace = (id?: string): Workspace => {
  const designer = useDesigner()
  const workspaceId = id || useContext(WorkspaceContext)?.id
  if (workspaceId) {
    // console.log('useWorkspace: workspaceId', workspaceId)
    return designer.workbench.findWorkspaceById(workspaceId)!
  }
  if ((globalThisPolyfill as any)['__DESIGNABLE_WORKSPACE__'])
    return (globalThisPolyfill as any)['__DESIGNABLE_WORKSPACE__']
  
  // console.log('useWorkspace: designer.workbench.currentWorkspace')
  return designer.workbench.currentWorkspace
}
