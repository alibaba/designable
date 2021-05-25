import { Engine } from '../models'
import { KeyDownEvent, KeyUpEvent } from '../events'

export const useKeyboardEffect = (engine: Engine) => {
  engine.subscribeTo(KeyDownEvent, (event) => {
    const keyboard = engine.keyboard
    if (!keyboard) return
    keyboard.handleKeyboard(event, {
      ...event.context,
      workspace:
        engine.workbench.activeWorkspace || engine.workbench.currentWorkspace,
    })
  })

  engine.subscribeTo(KeyUpEvent, (event) => {
    const keyboard = engine.keyboard
    if (!keyboard) return
    keyboard.handleKeyboard(event, {
      ...event.context,
      workspace:
        engine.workbench.activeWorkspace || engine.workbench.currentWorkspace,
    })
  })
}
