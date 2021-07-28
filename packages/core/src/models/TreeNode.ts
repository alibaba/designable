import { action, define, observable, toJS } from '@formily/reactive'
import { uid, isFn } from '@designable/shared'
import { Operation } from './Operation'
import {
  InsertBeforeEvent,
  InsertAfterEvent,
  InsertChildrenEvent,
  PrependNodeEvent,
  AppendNodeEvent,
  WrapNodeEvent,
  UpdateChildrenEvent,
  RemoveNodeEvent,
  UpdateNodePropsEvent,
} from '../events'
import {
  IDesignerControllerProps,
  IDesignerProps,
  IControlNodeMetaType,
} from '../types'
import { GlobalRegistry } from '../registry'

export interface ITreeNode {
  componentName?: string
  operation?: Operation
  hidden?: boolean
  isSourceNode?: boolean
  id?: string
  props?: Record<string | number | symbol, any>
  children?: ITreeNode[]
}

export interface INodeFinder {
  (node: TreeNode): boolean
}

const TreeNodes = new Map<string, TreeNode>()

const CommonDesignerPropsMap = new Map<string, IDesignerControllerProps>()

const removeNode = (node: TreeNode) => {
  if (node.parent) {
    node.parent.children = node.parent.children.filter(
      (child) => child !== node
    )
  }
}

const resetNodesParent = (nodes: TreeNode[], parent: TreeNode) => {
  const resetDepth = (node: TreeNode) => {
    node.depth = node.parent ? node.parent.depth + 1 : 0
    node.children.forEach(resetDepth)
  }

  const shallowReset = (node: TreeNode) => {
    node.parent = parent
    node.root = parent.root
    resetDepth(node)
  }

  const deepReset = (node: TreeNode) => {
    shallowReset(node)
    resetNodesParent(node.children, node)
  }

  return nodes.map((node) => {
    if (node === parent) return node
    if (!parent.isSourceNode) {
      if (node.isSourceNode) {
        node = node.clone(parent)
        deepReset(node)
      } else if (!node.isRoot && node.isInOperation) {
        node.root.operation.selection?.remove?.(node)
        removeNode(node)
        shallowReset(node)
      } else {
        deepReset(node)
      }
    } else {
      deepReset(node)
    }
    if (!TreeNodes.has(node.id)) {
      TreeNodes.set(node.id, node)
      CommonDesignerPropsMap.set(node.componentName, node.designerProps)
    }
    return node
  })
}

const resetNodeParent = (node: TreeNode, parent: TreeNode) => {
  return resetNodesParent([node], parent)[0]
}

export class TreeNode {
  parent: TreeNode

  root: TreeNode

  operation: Operation

  id: string

  depth = 0

  hidden = false

  componentName = 'NO_NAME_COMPONENT'

  props: ITreeNode['props'] = {}

  children: TreeNode[] = []

  isSelfSourceNode: boolean

  originDesignerProps: IDesignerProps

  constructor(node?: ITreeNode, parent?: TreeNode) {
    if (node instanceof TreeNode) {
      return node
    }
    this.id = node.id || uid()
    if (parent) {
      this.parent = parent
      this.depth = parent.depth + 1
      this.root = parent.root
      TreeNodes.set(this.id, this)
    } else {
      this.root = this
      this.operation = node.operation
      this.isSelfSourceNode = node.isSourceNode || false
      TreeNodes.set(this.id, this)
    }
    if (node) {
      this.from(node)
    }
    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      componentName: observable.ref,
      props: observable,
      hidden: observable.ref,
      children: observable.shallow,
      wrapNode: action,
      prependNode: action,
      appendNode: action,
      insertAfter: action,
      insertBefore: action,
      remove: action,
      setNodeProps: action,
      setNodeChildren: action,
      setComponentName: action,
    })
  }

  set designerProps(props: IDesignerProps) {
    this.originDesignerProps = props || {}
  }

  get designerProps(): IDesignerProps {
    const designerProps = GlobalRegistry.getComponentDesignerProps(
      this.componentName
    )
    const finallyDesignerProps: IDesignerProps = {}
    if (isFn(designerProps)) {
      Object.assign(
        finallyDesignerProps,
        designerProps(this),
        this.originDesignerProps
      )
    } else {
      Object.assign(
        finallyDesignerProps,
        designerProps,
        this.originDesignerProps
      )
    }
    const display = this.props?.style?.display

    if (display) {
      finallyDesignerProps.inlineLayout =
        display === 'inline' || display === 'inline-block'
    }

    return finallyDesignerProps
  }

  get previous() {
    if (this.parent === this || !this.parent) return
    return this.parent.children[this.index - 1]
  }

  get next() {
    if (this.parent === this || !this.parent) return
    return this.parent.children[this.index + 1]
  }

  get siblings() {
    if (this.parent) {
      return this.parent.children.filter((node) => node !== this)
    }
    return []
  }

  get index() {
    if (this.parent === this || !this.parent) return 0
    return this.parent.children.indexOf(this)
  }

  get childrens(): TreeNode[] {
    return this.children.reduce((buf, node) => {
      return buf.concat(node).concat(node.childrens)
    }, [])
  }

  get isRoot() {
    return this === this.root
  }

  get isInOperation() {
    return !!this.root?.operation
  }

  get lastChild() {
    return this.children[this.children.length - 1]
  }

  get firstChild() {
    return this.children[0]
  }

  getPrevious(step = 1) {
    return this.parent.children[this.index - step]
  }

  getAfter(step = 1) {
    return this.parent.children[this.index + step]
  }

  getSibling(index = 0) {
    return this.parent.children[index]
  }

  isMyAncestor(node: TreeNode) {
    if (node === this || this?.parent === node) return false
    return node.contains(this)
  }

  isMyParent(node: TreeNode) {
    return this?.parent === node
  }

  isMyParents(node: TreeNode) {
    if (node === this) return false
    return this.isMyParent(node) || this.isMyAncestor(node)
  }

  isMyChild(node: TreeNode) {
    return node.isMyParent(this)
  }

  isMyChildren(node: TreeNode) {
    return node.isMyParents(this)
  }

  get isSourceNode() {
    return this.root.isSelfSourceNode
  }

  takeSnapshot() {
    if (this.root?.operation) {
      this.root.operation.snapshot()
    }
  }

  triggerMutation<T>(event: any, callback?: () => T, defaults?: T): T {
    if (this.root?.operation) {
      const result = this.root.operation.dispatch(event, callback) || defaults
      this.takeSnapshot()
      return result
    } else if (isFn(callback)) {
      return callback()
    }
  }

  find(finder: INodeFinder): TreeNode {
    if (finder(this)) {
      return this
    } else {
      let finded = undefined
      this.eachChildren((node) => {
        if (finder(node)) {
          finded = node
          return false
        }
      })
      return finded
    }
  }

  findAll(finder: INodeFinder): TreeNode[] {
    const results = []
    if (finder(this)) {
      results.push(this)
    }
    this.eachChildren((node) => {
      if (finder(node)) {
        results.push(node)
      }
    })
    return results
  }

  distanceTo(node: TreeNode) {
    if (this.root !== node.root) {
      return Infinity
    }
    if (this.parent !== node.parent) {
      return Infinity
    }
    return Math.abs(this.index - node.index)
  }

  crossSiblings(node: TreeNode): TreeNode[] {
    if (this.parent !== node.parent) return []
    const minIndex = Math.min(this.index, node.index)
    const maxIndex = Math.max(this.index, node.index)
    const results = []
    for (let i = minIndex + 1; i < maxIndex; i++) {
      results.push(this.parent.children[i])
    }
    return results
  }

  matchNodeMeta(meta: IControlNodeMetaType) {
    if (meta?.componentName === this.componentName) return true
    if (meta?.id === this.id) return true
    return false
  }

  allowSibling(nodes: TreeNode[]) {
    if (this.designerProps?.allowSiblings?.(this, nodes) === false) return false
    return this.parent?.allowAppend(nodes)
  }

  allowAppend(nodes: TreeNode[]) {
    if (!this.designerProps?.droppable) return false
    if (this.designerProps?.allowAppend?.(this, nodes) === false) return false
    return true
  }

  findById(id: string) {
    if (!id) return
    if (this.id === id) return this
    if (this.children?.length > 0) {
      return TreeNodes.get(id)
    }
  }

  getParents(node?: TreeNode): TreeNode[] {
    const _node = node || this
    return _node?.parent
      ? [_node.parent].concat(this.getParents(_node.parent))
      : []
  }

  getParentByDepth(depth = 0) {
    let parent = this.parent
    if (parent?.depth === depth) {
      return parent
    } else {
      return parent?.getParentByDepth(depth)
    }
  }

  contains(...nodes: TreeNode[]) {
    return nodes.every((node) => {
      if (
        node === this ||
        node?.parent === this ||
        node?.getParentByDepth(this.depth) === this
      ) {
        return true
      }
      return false
    })
  }

  eachChildren(callback?: (node: TreeNode) => void | boolean) {
    if (isFn(callback)) {
      for (let i = 0; i < this.children.length; i++) {
        const node = this.children[i]
        if (callback(node) === false) return
        node.eachChildren(callback)
      }
    }
  }

  resetNodesParent(nodes: TreeNode[], parent: TreeNode) {
    return resetNodesParent(
      nodes.filter((node) => node !== this),
      parent
    )
  }

  setNodeProps(props?: any) {
    return this.triggerMutation(
      new UpdateNodePropsEvent({
        target: this,
        source: null,
      }),
      () => {
        Object.assign(this.props, props)
      }
    )
  }

  setComponentName(name: string) {
    this.componentName = name
  }

  prependNode(...nodes: TreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return []
    const originSourceParents = nodes.map((node) => node.parent)
    const newNodes = this.resetNodesParent(nodes, this)
    if (!newNodes.length) return []
    return this.triggerMutation(
      new PrependNodeEvent({
        originSourceParents,
        target: this,
        source: newNodes,
      }),
      () => {
        this.children = newNodes.concat(this.children)
        return newNodes
      },
      []
    )
  }

  appendNode(...nodes: TreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return []
    const originSourceParents = nodes.map((node) => node.parent)
    const newNodes = this.resetNodesParent(nodes, this)
    if (!newNodes.length) return []
    return this.triggerMutation(
      new AppendNodeEvent({
        originSourceParents,
        target: this,
        source: newNodes,
      }),
      () => {
        this.children = this.children.concat(newNodes)
        return newNodes
      },
      []
    )
  }

  wrapNode(wrapper: TreeNode) {
    if (wrapper === this) return
    const parent = this.parent
    return this.triggerMutation(
      new WrapNodeEvent({
        target: this,
        source: wrapper,
      }),
      () => {
        resetNodeParent(this, wrapper)
        resetNodeParent(wrapper, parent)
        return wrapper
      }
    )
  }

  insertAfter(...nodes: TreeNode[]) {
    const parent = this.parent
    if (nodes.some((node) => node.contains(this))) return []
    if (parent?.children?.length) {
      const originSourceParents = nodes.map((node) => node.parent)
      const newNodes = this.resetNodesParent(nodes, parent)
      if (!newNodes.length) return []

      return this.triggerMutation(
        new InsertAfterEvent({
          originSourceParents,
          target: this,
          source: newNodes,
        }),
        () => {
          parent.children = parent.children.reduce((buf, node) => {
            if (node === this) {
              return buf.concat([node]).concat(newNodes)
            } else {
              return buf.concat([node])
            }
          }, [])
          return newNodes
        },
        []
      )
    }
    return []
  }

  insertBefore(...nodes: TreeNode[]) {
    const parent = this.parent
    if (nodes.some((node) => node.contains(this))) return []
    if (parent?.children?.length) {
      const originSourceParents = nodes.map((node) => node.parent)
      const newNodes = this.resetNodesParent(nodes, parent)
      if (!newNodes.length) return []
      return this.triggerMutation(
        new InsertBeforeEvent({
          originSourceParents,
          target: this,
          source: newNodes,
        }),
        () => {
          parent.children = parent.children.reduce((buf, node) => {
            if (node === this) {
              return buf.concat(newNodes).concat([node])
            } else {
              return buf.concat([node])
            }
          }, [])
          return newNodes
        },
        []
      )
    }
    return []
  }

  insertChildren(start: number, ...nodes: TreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return []
    if (this.children?.length) {
      const originSourceParents = nodes.map((node) => node.parent)
      const newNodes = this.resetNodesParent(nodes, this)
      if (!newNodes.length) return []
      return this.triggerMutation(
        new InsertChildrenEvent({
          originSourceParents,
          target: this,
          source: newNodes,
        }),
        () => {
          this.children = this.children.reduce((buf, node, index) => {
            if (index === start) {
              return buf.concat(newNodes).concat([node])
            }
            return buf.concat([node])
          }, [])
          return newNodes
        },
        []
      )
    }
    return []
  }

  setNodeChildren(...nodes: TreeNode[]) {
    const originSourceParents = nodes.map((node) => node.parent)
    const newNodes = this.resetNodesParent(nodes, this)
    return this.triggerMutation(
      new UpdateChildrenEvent({
        originSourceParents,
        target: this,
        source: newNodes,
      }),
      () => {
        this.children = newNodes
        return newNodes
      },
      []
    )
  }

  remove() {
    return this.triggerMutation(
      new RemoveNodeEvent({
        target: this,
        source: null,
      }),
      () => {
        removeNode(this)
        TreeNodes.delete(this.id)
      }
    )
  }

  clone(parent?: TreeNode) {
    const newNode = new TreeNode(
      {
        id: uid(),
        componentName: this.componentName,
        props: toJS(this.props),
        children: [],
      },
      parent ? parent : this.parent
    )
    newNode.children = resetNodesParent(
      this.children.map((treeNode) => {
        return treeNode.clone(newNode)
      }),
      newNode
    )
    return newNode
  }

  from(node?: ITreeNode) {
    if (!node) return
    if (node.id && node.id !== this.id) {
      TreeNodes.delete(this.id)
      TreeNodes.set(node.id, this)
      this.id = node.id
    }
    if (node.componentName) {
      this.componentName = node.componentName
    }
    this.props = {
      ...this.designerProps?.defaultProps,
      ...node.props,
    }
    if (node.hidden) {
      this.hidden = node.hidden
    }
    if (node.children) {
      this.children =
        node.children?.map?.((node) => {
          return new TreeNode(node, this)
        }) || []
    }
  }

  serialize(): ITreeNode {
    return {
      id: this.id,
      componentName: this.componentName,
      props: toJS(this.props),
      hidden: this.hidden,
      children: this.children.map((treeNode) => {
        return treeNode.serialize()
      }),
    }
  }

  create(node: ITreeNode, parent?: TreeNode) {
    return new TreeNode(node, parent)
  }
}
