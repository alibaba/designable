import { useOperation } from './useOperation'

export const useMoveHelper = (workspaceId?: string) => {
  const operation = useOperation(workspaceId)
  return operation?.moveHelper
}
