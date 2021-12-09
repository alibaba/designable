import { useWorkspace } from './useWorkspace'

export const useOperation = (workspaceId?: string) => {
  const workspace = useWorkspace(workspaceId)
  return workspace?.operation
}
