import { useOperation } from './useOperation'

export const useTranslateHelper = (workspaceId?: string) => {
  const operation = useOperation(workspaceId)
  return operation?.translateHelper
}
