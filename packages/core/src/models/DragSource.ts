import { each, uid } from '@designable/shared'
import { TreeNode, ITreeNode } from './TreeNode'

export class DragSource {
  tree: TreeNode
  prefix: string
  constructor() {
    this.tree = new TreeNode({
      isSourceNode: true,
      componentName: 'SourceRoot',
    })
    this.prefix = uid()
  }

  setSources(sources: Record<string, ITreeNode[]>) {
    each(sources, (data, group) => {
      this.setSourcesByGroup(group, data)
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
        id: `${this.prefix}_${group}`,
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
        id: `${this.prefix}_${group}`,
      })
      newParent.setNodeChildren(...nodes)
      this.tree.appendNode(newParent)
    }
  }

  getAllGroup() {
    const nodes = this.tree.findAll(
      (node) => node.componentName === 'SourceGroup'
    )
    return nodes
  }

  getAllSources(): TreeNode[] {
    return this.getAllGroup().reduce((buf, groupNode) => {
      return buf.concat(this.getSourcesByGroup(groupNode.id))
    }, [])
  }

  getSourcesByGroup(group: string) {
    const parent = this.tree.findById(`${this.prefix}_${group}`)
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
    group: string,
    callback?: (
      previousValue: T,
      currentValue: TreeNode,
      index: number,
      array: TreeNode[]
    ) => T,
    init?: T
  ) {
    const sources = this.getSourcesByGroup(group)
    return sources?.reduce?.(callback, init)
  }
}

export const GlobalDragSource = new DragSource()
