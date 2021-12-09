import { useDesigner } from './useDesigner'

export const useWorkbench = () => {
  const designer = useDesigner()
  return designer.workbench
}
