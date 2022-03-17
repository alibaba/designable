import { useOperation } from './useOperation'

export const useDragLine = (workspaceId?: string) => {
  const operation = useOperation(workspaceId)
  return operation?.dragLine
}
