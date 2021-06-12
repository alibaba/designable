import { useDesigner } from './useDesigner'
import { useTreeNode } from './useTreeNode'

export const useNodeIdProps = () => {
  const node = useTreeNode()
  const designer = useDesigner()
  return {
    [designer.props.nodeIdAttrName]: node.id,
  }
}
