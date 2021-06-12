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
      componentName: 'Root',
      operation: this,
      children: this.engine.props.defaultComponentTree || [],
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

  dispatch(event: ICustomEvent) {
    this.workspace.dispatch(event)
  }

  getSelectedNodes() {
    return this.selection.selected.map((id) => this.tree.findById(id))
  }

  setDragNodes(nodes: TreeNode[]) {
    this.outlineDragon.setDragNodes(nodes)
    this.viewportDragon.setDragNodes(nodes)
  }

  getDragNodes() {
    if (this.outlineDragon.dragNodes?.length) {
      return this.outlineDragon.dragNodes
    }
    return this.viewportDragon.dragNodes
  }

  getClosestNode() {
    return this.viewportDragon.closestNode || this.outlineDragon.closestNode
  }

  getClosestDirection() {
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
      if (node !== this.tree && node?.designerProps?.deletable !== false) {
        const previousIndex = node.index - 1
        const afterIndex = node.index + 1
        const parent = node.parent
        node.remove()
        const previus = previousIndex > -1 && parent.children[previousIndex]
        const after =
          afterIndex < parent.children.length && parent.children[afterIndex]
        this.selection.select(previus ? previus : after ? after : node.parent)
        this.hover.clear()
      }
    }
  }

  cloneNodes(nodes: TreeNode[]) {
    const groups: { [parentId: string]: TreeNode[] } = {}
    const lastGroupNode: { [parentId: string]: TreeNode } = {}
    const filterNestedNode = nodes.filter((node) => {
      return !nodes.some((parent) => {
        return node.isMyParents(parent)
      })
    })
    filterNestedNode.forEach((node) => {
      if (node?.designerProps?.cloneable === false) return
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
    each(groups, (nodes, parentId) => {
      const lastNode = lastGroupNode[parentId]
      let insertPoint = lastNode
      nodes.forEach((node) => {
        const cloned = node.clone()
        if (
          this.selection.has(node) &&
          insertPoint.parent.allowAppend([cloned])
        ) {
          insertPoint.insertAfter(cloned)
          insertPoint = insertPoint.after
        } else if (this.selection.length === 1) {
          const targetNode = this.tree.findById(this.selection.first)
          if (targetNode && targetNode.allowAppend([cloned])) {
            targetNode.appendNode(cloned)
          }
        }
      })
    })
  }

  makeObservable() {
    define(this, {
      hover: observable.ref,
      removeNodes: action,
      cloneNodes: action,
    })
  }

  snapshot() {
    cancelIdle(this.requests.snapshot)
    this.requests.snapshot = requestIdle(() => {
      this.workspace.history.push()
    })
  }

  from(operation?: IOperation) {
    if (!operation) return
    if (operation.tree) {
      this.tree.from(operation.tree)
    }
    if (operation.selected) {
      this.selection.batchSelect(operation.selected)
    }
  }

  serialize(): IOperation {
    return {
      tree: this.tree.serialize(),
      selected: this.selection.selected,
    }
  }
}
