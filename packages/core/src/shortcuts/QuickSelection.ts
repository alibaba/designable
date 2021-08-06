import { KeyCode, Shortcut } from '../models'

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
      const lastNode = tree.findById(selection.last)
      if (lastNode) {
        const previousNode = lastNode.previous
        if (previousNode) {
          selection.select(previousNode)
          operation.snapshot('select:prev')
        } else if (lastNode.parent) {
          selection.select(lastNode.parent)
          operation.snapshot('select:prev')
        } else {
          selection.select(lastNode.lastChild)
          operation.snapshot('select:prev')
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
      const lastNode = tree.findById(selection.last)
      if (lastNode) {
        const nextNode = lastNode.next
        if (nextNode) {
          selection.select(nextNode)
          operation.snapshot('select:next')
        } else if (lastNode.parent) {
          selection.select(lastNode.parent)
          operation.snapshot('select:next')
        } else {
          selection.select(lastNode.firstChild)
          operation.snapshot('select:next')
        }
      }
    }
  },
})
