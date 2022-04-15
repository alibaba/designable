import { useOperation } from './useOperation'

export const useTransformHelper = (workspaceId?: string) => {
  const operation = useOperation(workspaceId)
  return operation?.transformHelper
}
