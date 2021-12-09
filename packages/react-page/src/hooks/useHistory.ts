import { useWorkspace } from './useWorkspace'

export const useHistory = (workspaceId?: string) => {
  const workspace = useWorkspace(workspaceId)
  return workspace?.history
}
