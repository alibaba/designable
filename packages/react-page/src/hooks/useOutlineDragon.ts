import { useOperation } from './useOperation'

export const useOutlineDragon = (workspaceId?: string) => {
  const operation = useOperation(workspaceId)
  return operation?.outlineDragon
}
