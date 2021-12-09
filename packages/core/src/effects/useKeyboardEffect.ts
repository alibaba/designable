import { Designer } from '../models'
import { KeyDownEvent, KeyUpEvent } from '../events'

export const useKeyboardEffect = (designer: Designer) => {
  designer.subscribeTo(KeyDownEvent, (event) => {
    const keyboard = designer.keyboard
    if (!keyboard) return
    const workspace =
      designer.workbench.activeWorkspace || designer.workbench.currentWorkspace
    keyboard.handleKeyboard(event, workspace.getEventContext())
  })

  designer.subscribeTo(KeyUpEvent, (event) => {
    const keyboard = designer.keyboard
    if (!keyboard) return
    const workspace =
      designer.workbench.activeWorkspace || designer.workbench.currentWorkspace
    keyboard.handleKeyboard(event, workspace.getEventContext())
  })
}
