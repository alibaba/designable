import { useCurrentNode } from './useCurrentNode'
import { useSelected } from './useSelected'

export const useCurrentNodeSelected = () => {
  const node = useCurrentNode()
  const selected = useSelected()
  return selected.length === 1 && node.id === selected[0]
}
