import { useOperation } from './useOperation'

export const useTree = (workspaceId?: string) => {
  const operation = useOperation(workspaceId)
  return operation?.tree
}
