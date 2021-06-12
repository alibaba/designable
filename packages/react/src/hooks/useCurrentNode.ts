import { useSelected } from './useSelected'
import { useTree } from './useTree'

export const useCurrentNode = () => {
  const selected = useSelected()
  const tree = useTree()
  return tree?.findById?.(selected[0])
}
