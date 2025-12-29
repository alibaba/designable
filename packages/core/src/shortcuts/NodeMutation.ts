import { KeyCode, Shortcut, TreeNode } from '../models/index'

/**
 * 快捷删除，快捷复制粘贴
 */

export const DeleteNodes = new Shortcut({
  codes: [[KeyCode.Backspace], [KeyCode.Delete]],
  handler(context) {
    const operation = context?.workspace.operation
    if (operation) {
      const validNodes = operation.selection.selectedNodes.filter((node): node is TreeNode => node != null)
      TreeNode.remove(validNodes)
    }
  },
})

interface IClipboard {
  nodes: TreeNode[]
}

const Clipboard: IClipboard = {
  nodes: [],
}

export const CopyNodes = new Shortcut({
  codes: [
    [KeyCode.Meta, KeyCode.C],
    [KeyCode.Control, KeyCode.C],
  ],
  handler(context) {
    const operation = context?.workspace.operation
    if (operation) {
      const validNodes = operation.selection.selectedNodes.filter((node): node is TreeNode => node != null)
      Clipboard.nodes = validNodes
    }
  },
})

export const PasteNodes = new Shortcut({
  codes: [
    [KeyCode.Meta, KeyCode.V],
    [KeyCode.Control, KeyCode.V],
  ],
  handler(context) {
    const operation = context?.workspace.operation
    if (operation) {
      TreeNode.clone(Clipboard.nodes)
    }
  },
})
