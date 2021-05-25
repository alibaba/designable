import { useOperation } from './useOperation'

export const useHover = (workspaceId?: string) => {
  const operation = useOperation(workspaceId)
  return operation?.hover
}
