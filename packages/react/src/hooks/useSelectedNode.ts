import { useSelected } from './useSelected'
import { useTree } from './useTree'

export const useSelectedNode = (workspaceId?: string) => {
  const selected = useSelected(workspaceId)
  const tree = useTree(workspaceId)
  return tree?.findById?.(selected[0])
}

/**
 * @deprecated
 * please use useSelectedNode
 */
export const useCurrentNode = useSelectedNode
