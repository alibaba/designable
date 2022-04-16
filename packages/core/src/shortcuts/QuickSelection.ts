import { KeyCode, Shortcut, TreeNode } from '../models'

const findBottomLastChild = (node: TreeNode) => {
  if (!node) return node
  if (node.lastChild) {
    return findBottomLastChild(node.lastChild)
  }
  return node
}

const findTopParentNext = (node: TreeNode) => {
  if (!node.parent) return node
  if (node.parent?.next) return node.parent.next
  return findTopParentNext(node.parent)
}

export const SelectPrevNode = new Shortcut({
  codes: [
    [KeyCode.Up],
    [KeyCode.PageUp],
    [KeyCode.ArrowUp],
    [KeyCode.Left],
    [KeyCode.LeftWindowKey],
    [KeyCode.ArrowLeft],
  ],
  handler(context) {
    const operation = context?.workspace.operation
    if (operation) {
      const tree = operation.tree
      const selection = operation.selection
      const selectedNode = tree.findById(selection.last)
      if (selectedNode) {
        const previousNode = selectedNode.previous
        if (previousNode) {
          const bottom = findBottomLastChild(previousNode)
          if (bottom) {
            selection.select(bottom)
          } else {
            selection.select(previousNode)
          }
        } else if (selectedNode.parent) {
          selection.select(selectedNode.parent)
        } else {
          const bottom = findBottomLastChild(selectedNode.lastChild)
          if (bottom) {
            selection.select(bottom)
          }
        }
      }
    }
  },
})

export const SelectNextNode = new Shortcut({
  codes: [
    [KeyCode.Down],
    [KeyCode.PageDown],
    [KeyCode.ArrowDown],
    [KeyCode.Right],
    [KeyCode.RightWindowKey],
    [KeyCode.ArrowRight],
  ],
  handler(context) {
    const operation = context?.workspace.operation
    if (operation) {
      const tree = operation.tree
      const selection = operation.selection
      const selectedNode = tree.findById(selection.last)
      if (selectedNode) {
        const nextNode = selectedNode.firstChild
          ? selectedNode.firstChild
          : selectedNode.next
        if (nextNode) {
          selection.select(nextNode)
        } else {
          selection.select(findTopParentNext(selectedNode))
        }
      }
    }
  },
})
