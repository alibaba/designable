import { useWorkspace } from './useWorkspace'

export const useOutline = (workspaceId?: string) => {
  const workspace = useWorkspace(workspaceId)
  return workspace?.outline
}
