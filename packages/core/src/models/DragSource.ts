import { each, uid } from '@designable/shared'
import { GlobalRegistry } from '../registry'
import { IDesignerControllerProps, LocaleMessages } from '../types'
import { TreeNode, ITreeNode } from './TreeNode'

export interface ISourceNode
  extends Omit<ITreeNode, 'sourceName' | 'isSourceNode' | 'children'> {
  designerProps?: IDesignerControllerProps
  designerLocales?: LocaleMessages
  children?: ISourceNode[]
}

const createNodesBySources = (group: string, sources: ISourceNode[]) => {
  const register = (child: ISourceNode) => {
    const designerProps = child.designerProps
    const designerLocales = child.designerLocales
    if (child.children) {
      child.children = child.children.map(register)
    }
    const node = new TreeNode(child)
    node.sourceName = `${group}-${node.id}`
    if (designerProps)
      GlobalRegistry.setSourceDesignerProps(node.sourceName, designerProps)
    if (designerLocales)
      GlobalRegistry.setSourceDesignerLocales(node.sourceName, designerLocales)
    return node
  }
  return sources.map(register)
}

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

  get size() {
    return this.getAllSources().length
  }

  setSources(sources: Record<string, ISourceNode[]>) {
    each(sources, (data, group) => {
      this.setSourcesByGroup(group, data)
    })
  }

  setSourcesByGroup(group: string, sources: ISourceNode[]) {
    const parent = this.tree.findById(group)
    const nodes = createNodesBySources(group, sources)
    if (parent) {
      parent.setChildren(...nodes)
    } else {
      const newParent = new TreeNode({
        componentName: 'SourceGroup',
        id: `${this.prefix}-${group}`,
      })
      newParent.setChildren(...nodes)
      this.tree.append(newParent)
    }
  }

  appendSourcesByGroup(group: string, sources: ISourceNode[]) {
    const parent = this.tree.findById(group)
    const nodes = createNodesBySources(this.prefix, group, sources)
    if (parent) {
      parent.append(...nodes)
    } else {
      const newParent = new TreeNode({
        componentName: 'SourceGroup',
        id: `${this.prefix}-${group}`,
      })
      newParent.setChildren(...nodes)
      this.tree.append(newParent)
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
    const parent = this.tree.findById(`${this.prefix}-${group}`)
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
