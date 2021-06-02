import { KeyCode, Shortcut, TreeNode } from '../models'

/**
 * 快捷删除，快捷复制粘贴
 */

export const DeleteNodes = new Shortcut({
  codes: [KeyCode.Backspace],
  handler(context) {
    const operation = context?.workspace.operation
    if (operation) {
      operation.removeNodes(operation.getSelectedNodes())
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
  codes: [KeyCode.Meta, KeyCode.C],
  handler(context) {
    const operation = context?.workspace.operation
    if (operation) {
      Clipboard.nodes = operation.getSelectedNodes()
    }
  },
})

export const PasteNodes = new Shortcut({
  codes: [KeyCode.Meta, KeyCode.V],
  handler(context) {
    const operation = context?.workspace.operation
    if (operation) {
      operation.cloneNodes(Clipboard.nodes)
    }
  },
})
