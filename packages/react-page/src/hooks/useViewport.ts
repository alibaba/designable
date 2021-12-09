import { useWorkspace } from './useWorkspace'

export const useViewport = (workspaceId?: string) => {
  const workspace = useWorkspace(workspaceId)
  return workspace?.viewport
}
