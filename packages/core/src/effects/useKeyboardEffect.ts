import { Engine } from '../models/index'
import { KeyDownEvent, KeyUpEvent } from '../events/index'

export const useKeyboardEffect = (engine: Engine) => {
  engine.subscribeTo(KeyDownEvent, (event) => {
    const keyboard = engine.keyboard
    if (!keyboard) return
    const workspace =
      engine.workbench.activeWorkspace || engine.workbench.currentWorkspace
    keyboard.handleKeyboard(event, workspace.getEventContext())
  })

  engine.subscribeTo(KeyUpEvent, (event) => {
    const keyboard = engine.keyboard
    if (!keyboard) return
    const workspace =
      engine.workbench.activeWorkspace || engine.workbench.currentWorkspace
    keyboard.handleKeyboard(event, workspace.getEventContext())
  })
}
