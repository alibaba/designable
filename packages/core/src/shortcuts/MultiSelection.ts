import { KeyCode, Shortcut } from '../models'

export const SelectNodes = new Shortcut({
  codes: [[KeyCode.Metadata], [KeyCode.Control]],
})

export const SelectSameTypeNodes = new Shortcut({
  codes: [KeyCode.Shift],
})

export const PreventCommandX = new Shortcut({
  codes: [
    [KeyCode.Metadata, KeyCode.X],
    [KeyCode.Control, KeyCode.X],
  ],
})

export const SelectAllNodes = new Shortcut({
  codes: [
    [KeyCode.Metadata, KeyCode.A],
    [KeyCode.Control, KeyCode.A],
  ],
  handler(context) {
    const operation = context?.workspace.operation
    if (operation) {
      const tree = operation.tree
      const selection = operation.selection
      selection.batchSelect(tree.descendants)
    }
  },
})
