import { Path } from '@formily/path'
import { Engine, TreeNode } from '../models'
import { MouseDoubleClickEvent, MouseClickEvent } from '../events'

type GlobalState = {
  activeElements: Map<HTMLInputElement, TreeNode>
  requestTimer: any
  isComposition: boolean
}

function placeCaretAtEnd(el: HTMLInputElement, isCollapse: boolean) {
  const currentSelection = window.getSelection()
  if (currentSelection.containsNode(el)) return
  el.focus()
  const range = document.createRange()
  range.selectNodeContents(el)
  if (!isCollapse) {
    range.collapse(false)
  }
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

export const useContentEditableEffect = (engine: Engine) => {
  const globalState: GlobalState = {
    activeElements: new Map(),
    requestTimer: null,
    isComposition: false,
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
        if (globalState.isComposition) return
        Path.setIn(
          node.props,
          this.getAttribute(engine.props.contentEditableAttrName),
          target?.textContent
        )
        setTimeout(() => {
          placeCaretAtEnd(this, window.getSelection().isCollapsed)
        }, 16)
      }, 1000)
    }
  }

  function onCompositionHandler(event: CompositionEvent) {
    if (event.type === 'compositionend') {
      globalState.isComposition = false
      onInputHandler(event as any)
    } else {
      clearTimeout(globalState.requestTimer)
      globalState.isComposition = true
    }
  }

  function onPastHandler(event: ClipboardEvent) {
    event.preventDefault()
    const text = event.clipboardData.getData('text')
    this.textContent = text
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
      element.removeEventListener('compositionstart', onCompositionHandler)
      element.removeEventListener('compositionupdate', onCompositionHandler)
      element.removeEventListener('compositionend', onCompositionHandler)
      element.removeEventListener('past', onPastHandler)
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
            editableElement.addEventListener(
              'compositionstart',
              onCompositionHandler
            )
            editableElement.addEventListener(
              'compositionupdate',
              onCompositionHandler
            )
            editableElement.addEventListener(
              'compositionend',
              onCompositionHandler
            )
            editableElement.addEventListener('keydown', onKeyDownHandler)
            editableElement.addEventListener('paste', onPastHandler)
            placeCaretAtEnd(editableElement, false)
          }
        }
      }
    }
  })
}
