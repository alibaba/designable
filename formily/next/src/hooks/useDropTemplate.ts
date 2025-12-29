import { AppendNodeEvent, TreeNode, Engine } from '@designable/core'
import { useDesigner } from '@designable/react'
import { matchComponent, matchChildComponent } from '../shared.js'

export const useDropTemplate = (
  name: string,
  getChildren: (source: TreeNode[]) => TreeNode[]
) => {
  return useDesigner((designer: Engine) => {
    return designer.subscribeTo(AppendNodeEvent, (event: AppendNodeEvent) => {
      const { source, target } = event.data
      if (Array.isArray(target)) return
      if (!Array.isArray(source)) return
      if (
        matchComponent(
          target,
          (key: string) =>
            key === name &&
            source.every((child) => !matchChildComponent(child, name))
        ) &&
        target.children.length === 0
      ) {
        target.setChildren(...getChildren(source))
        return false
      }
    })
  })
}
