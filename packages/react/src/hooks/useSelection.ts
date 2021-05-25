import { useOperation } from './useOperation'

export const useSelection = (workspaceId?: string) => {
  const operation = useOperation(workspaceId)
  return operation?.selection
}
