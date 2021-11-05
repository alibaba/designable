import { useSelected } from './useSelected'
import { useTree } from './useTree'

export const useCurrentNode = (workspaceId?: string) => {
  const selected = useSelected(workspaceId)
  const tree = useTree(workspaceId)
  return tree?.findById?.(selected[0])
}
