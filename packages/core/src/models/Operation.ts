import { Workspace } from './Workspace'
import { Engine } from './Engine'
import { TreeNode, ITreeNode } from './TreeNode'
import { Selection } from './Selection'
import { Hover } from './Hover'
import { action, define, observable } from '@formily/reactive'
import { Dragon } from './Dragon'
import {
  cancelIdle,
  each,
  ICustomEvent,
  IPoint,
  isFn,
  requestIdle,
} from '@designable/shared'

export interface IOperation {
  tree?: ITreeNode
  selected?: string[]
}

export class Operation {
  workspace: Workspace

  engine: Engine

  tree: TreeNode

  selection: Selection

  viewportDragon: Dragon

  outlineDragon: Dragon

  hover: Hover

  requests = {
    snapshot: null,
  }

  constructor(workspace: Workspace) {
    this.engine = workspace.engine
    this.workspace = workspace
    this.tree = new TreeNode({
      componentName: this.engine.props.rootComponentName,
      ...this.engine.props.defaultComponentTree,
      operation: this,
    })
    this.selection = new Selection({
      operation: this,
    })
    this.hover = new Hover({
      operation: this,
    })
    this.outlineDragon = new Dragon({
      operation: this,
      sensitive: false,
      forceBlock: true,
      viewport: this.workspace.outline,
    })
    this.viewportDragon = new Dragon({
      operation: this,
      viewport: this.workspace.viewport,
    })
    this.selection.select(this.tree)
    this.makeObservable()
  }

  dispatch(event: ICustomEvent, callback?: () => void) {
    if (this.workspace.dispatch(event) === false) return
    if (isFn(callback)) return callback()
  }

  getSelectedNodes() {
    return this.selection.selected.map((id) => this.tree.findById(id))
  }

  setDragNodes(nodes: TreeNode[]) {
    const dragNodes = nodes.reduce((buf, node) => {
      if (isFn(node?.designerProps?.getDragNodes)) {
        const transformed = node.designerProps.getDragNodes(node)
        return transformed ? buf.concat(transformed) : buf
      }
      if (node.componentName === '$$ResourceNode$$')
        return buf.concat(node.children)
      return buf.concat([node])
    }, [])
    this.outlineDragon.setDragNodes(dragNodes)
    this.viewportDragon.setDragNodes(dragNodes)
  }

  getDragNodes() {
    if (this.outlineDragon.dragNodes?.length) {
      return this.outlineDragon.dragNodes
    }
    return this.viewportDragon.dragNodes
  }

  hasDragNodes() {
    return this.getDragNodes()?.length > 0
  }

  getDropNodes(parent: TreeNode) {
    const dragNodes = this.getDragNodes()
    return dragNodes.reduce((buf, node) => {
      if (isFn(node.designerProps?.getDropNodes)) {
        const cloned = node.isSourceNode ? node.clone(node.parent) : node
        const transformed = node.designerProps.getDropNodes(cloned, parent)
        return transformed ? buf.concat(transformed) : buf
      }
      if (node.componentName === '$$ResourceNode$$')
        return buf.concat(node.children)
      return buf.concat([node])
    }, [])
  }

  getClosestNode() {
    return this.viewportDragon.closestNode || this.outlineDragon.closestNode
  }

  getClosestPosition() {
    return (
      this.viewportDragon.closestDirection ||
      this.outlineDragon.closestDirection
    )
  }

  setTouchNode(node: TreeNode) {
    this.outlineDragon.setTouchNode(node)
    this.viewportDragon.setTouchNode(node)
  }

  dragWith(point: IPoint, touchNode?: TreeNode) {
    const viewport = this.workspace.viewport
    const outline = this.workspace.outline
    if (outline.isPointInViewport(point, false)) {
      this.outlineDragon.calculate({
        point,
        touchNode: touchNode || this.tree,
      })
      this.viewportDragon.calculate({
        touchNode: touchNode || this.tree,
        closestNode: this.outlineDragon.closestNode,
        closestDirection: this.outlineDragon.closestDirection,
      })
    } else if (viewport.isPointInViewport(point, false)) {
      this.viewportDragon.calculate({
        point,
        touchNode: touchNode || this.tree,
      })
      this.outlineDragon.calculate({
        touchNode: touchNode || this.tree,
        closestNode: this.viewportDragon.closestNode,
        closestDirection: this.viewportDragon.closestDirection,
      })
    } else {
      this.setTouchNode(null)
    }
  }

  dragClean() {
    this.outlineDragon.clear()
    this.viewportDragon.clear()
  }

  getTouchNode() {
    return this.outlineDragon.touchNode || this.viewportDragon.touchNode
  }

  setDropNode(node: TreeNode) {
    this.outlineDragon.setDropNode(node)
    this.viewportDragon.setDropNode(node)
  }

  getDropNode() {
    return this.outlineDragon.dropNode || this.viewportDragon.dropNode
  }

  removeNodes(nodes: TreeNode[]) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i]
      if (node.allowDelete()) {
        const previous = node.previous
        const next = node.next
        node.remove()
        this.selection.select(previous ? previous : next ? next : node.parent)
        this.hover.clear()
      }
    }
  }

  sortNodes(nodes: TreeNode[]) {
    return nodes.sort((before, after) => {
      if (before.depth !== after.depth) return 0
      return before.index - after.index >= 0 ? 1 : -1
    })
  }

  cloneNodes(nodes: TreeNode[]) {
    const groups: { [parentId: string]: TreeNode[] } = {}
    const lastGroupNode: { [parentId: string]: TreeNode } = {}
    const filterNestedNode = this.sortNodes(nodes).filter((node) => {
      return !nodes.some((parent) => {
        return node.isMyParents(parent)
      })
    })
    each(filterNestedNode, (node) => {
      if (node === node.root) return
      if (!node.allowClone()) return
      groups[node?.parent?.id] = groups[node?.parent?.id] || []
      groups[node?.parent?.id].push(node)
      if (lastGroupNode[node?.parent?.id]) {
        if (node.index > lastGroupNode[node?.parent?.id].index) {
          lastGroupNode[node?.parent?.id] = node
        }
      } else {
        lastGroupNode[node?.parent?.id] = node
      }
    })
    const parents = new Map<TreeNode, TreeNode[]>()
    each(groups, (nodes, parentId) => {
      const lastNode = lastGroupNode[parentId]
      let insertPoint = lastNode
      each(nodes, (node) => {
        const cloned = node.clone()
        if (!cloned) return
        if (
          this.selection.has(node) &&
          insertPoint.parent.allowAppend([cloned])
        ) {
          insertPoint.insertAfter(cloned)
          insertPoint = insertPoint.next
        } else if (this.selection.length === 1) {
          const targetNode = this.tree.findById(this.selection.first)
          let cloneNodes = parents.get(targetNode)
          if (!cloneNodes) {
            cloneNodes = []
            parents.set(targetNode, cloneNodes)
          }
          if (targetNode && targetNode.allowAppend([cloned])) {
            cloneNodes.push(cloned)
          }
        }
      })
    })
    parents.forEach((nodes, target) => {
      if (!nodes.length) return
      target.append(...nodes)
    })
  }

  makeObservable() {
    define(this, {
      hover: observable.ref,
      removeNodes: action,
      cloneNodes: action,
    })
  }

  snapshot(type?: string) {
    cancelIdle(this.requests.snapshot)
    if (
      !this.workspace ||
      !this.workspace.history ||
      this.workspace.history.locking
    )
      return
    this.requests.snapshot = requestIdle(() => {
      this.workspace.history.push(type)
    })
  }

  from(operation?: IOperation) {
    if (!operation) return
    if (operation.tree) {
      this.tree.from(operation.tree)
    }
    if (operation.selected) {
      this.selection.selected = operation.selected
    }
  }

  serialize(): IOperation {
    return {
      tree: this.tree.serialize(),
      selected: [this.tree.id],
    }
  }
}
