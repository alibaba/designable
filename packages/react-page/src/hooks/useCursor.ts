import { useDesigner } from './useDesigner'

export const useCursor = () => {
  const designer = useDesigner()
  return designer.cursor
}
