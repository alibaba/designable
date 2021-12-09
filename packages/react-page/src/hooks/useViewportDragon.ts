import { useOperation } from './useOperation'

export const useDragon = (workspaceId?: string) => {
  const operation = useOperation(workspaceId)
  return operation?.viewportDragon
}
