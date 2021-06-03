import { TreeNode, ITreeNode } from './TreeNode'

export class DragSource {
  tree: TreeNode
  constructor() {
    this.tree = new TreeNode({
      componentName: 'SourceRoot',
    })
  }

  setSourcesByGroup(group: string, sources: ITreeNode[]) {
    const parent = this.tree.findById(group)
    const nodes = sources.map((node) => new TreeNode(node))
    if (parent) {
      parent.setNodeChildren(...nodes)
    } else {
      const newParent = new TreeNode({
        componentName: 'SourceGroup',
        id: group,
      })
      newParent.setNodeChildren(...nodes)
      this.tree.appendNode(newParent)
    }
  }

  appendSourcesByGroup(group: string, sources: ITreeNode[]) {
    const parent = this.tree.findById(group)
    const nodes = sources.map((node) => new TreeNode(node))
    if (parent) {
      parent.appendNode(...nodes)
    } else {
      const newParent = new TreeNode({
        componentName: 'SourceGroup',
        id: group,
      })
      newParent.setNodeChildren(...nodes)
      this.tree.appendNode(newParent)
    }
  }

  getSourcesByGroup(group: string) {
    const parent = this.tree.findById(group)
    return parent?.children
  }

  mapSourcesByGroup(group: string, callback?: (node: TreeNode) => void) {
    const sources = this.getSourcesByGroup(group)
    return sources?.map?.(callback)
  }

  eachSourcesByGroup(group: string, callback?: (node: TreeNode) => void) {
    const sources = this.getSourcesByGroup(group)
    return sources?.forEach?.(callback)
  }

  reduceSourcesByGroup<T>(
    id: string,
    callback?: (
      previousValue: T,
      currentValue: TreeNode,
      index: number,
      array: TreeNode[]
    ) => T,
    init?: T
  ) {
    const sources = this.getSourcesByGroup(id)
    return sources?.reduce?.(callback, init)
  }
}

export const GlobalDragSource = new DragSource()
