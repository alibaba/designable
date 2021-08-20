import { useSelection } from './useSelection'

export const useSelected = (workspaceId?: string) => {
  const selection = useSelection(workspaceId)
  return selection?.selected || []
}
