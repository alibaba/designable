import { Path } from '@formily/path'
import { Engine, TreeNode } from '../models'
import { MouseDoubleClickEvent, MouseClickEvent } from '../events'

type GlobalState = {
  activeElements: Map<HTMLInputElement, TreeNode>
  requestTimer: any
}

function placeCaretAtEnd(el: HTMLInputElement) {
  el.focus()
  let range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  let sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

export const useContentEditableEffect = (engine: Engine) => {
  const globalState: GlobalState = {
    activeElements: new Map(),
    requestTimer: null,
  }

  function onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  function onInputHandler(event: InputEvent) {
    const node = globalState.activeElements.get(this)
    event.stopPropagation()
    event.preventDefault()
    if (node) {
      const target = event.target as Element
      clearTimeout(globalState.requestTimer)
      globalState.requestTimer = setTimeout(() => {
        Path.setIn(
          node.props,
          this.getAttribute(engine.props.contentEditableAttrName),
          target?.textContent
        )
        setTimeout(() => {
          placeCaretAtEnd(this)
        }, 16)
      }, 1000)
    }
  }

  function findTargetNodeId(element: Element) {
    if (!element) return
    const nodeId = element.getAttribute(
      engine.props.contentEditableNodeIdAttrName
    )
    if (nodeId) return nodeId
    const parent = element.closest(`*[${engine.props.nodeIdAttrName}]`)
    if (parent) return parent.getAttribute(engine.props.nodeIdAttrName)
  }

  engine.subscribeTo(MouseClickEvent, (event) => {
    const target = event.data.target as Element
    const editableElement = target?.closest?.(
      `*[${engine.props.contentEditableAttrName}]`
    )
    if (
      editableElement &&
      editableElement.getAttribute('contenteditable') === 'true'
    )
      return
    globalState.activeElements.forEach((node, element) => {
      globalState.activeElements.delete(element)
      element.setAttribute('contenteditable', 'false')
      element.removeEventListener('input', onInputHandler)
    })
  })

  engine.subscribeTo(MouseDoubleClickEvent, (event) => {
    const target = event.data.target as Element
    const editableElement = target?.closest?.(
      `*[${engine.props.contentEditableAttrName}]`
    ) as HTMLInputElement
    const workspace = engine.workbench.activeWorkspace
    const tree = workspace.operation.tree
    if (editableElement) {
      const editable = editableElement.getAttribute('contenteditable')
      if (editable === 'false' || !editable) {
        const nodeId = findTargetNodeId(editableElement)
        if (nodeId) {
          const targetNode = tree.findById(nodeId)
          if (targetNode) {
            globalState.activeElements.set(editableElement, targetNode)
            editableElement.setAttribute('contenteditable', 'true')
            editableElement.focus()
            editableElement.addEventListener('input', onInputHandler)
            editableElement.addEventListener('keydown', onKeyDownHandler)
            placeCaretAtEnd(editableElement)
          }
        }
      }
    }
  })
}
