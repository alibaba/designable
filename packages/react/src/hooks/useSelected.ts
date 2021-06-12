import { useSelection } from './useSelection'

export const useSelected = () => {
  const selection = useSelection()
  return selection?.selected || []
}
