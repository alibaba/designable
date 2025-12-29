import { CursorType, KeyCode, Shortcut } from '../models/index'

export const CursorSwitchSelection = new Shortcut({
  codes: [KeyCode.Shift, KeyCode.S],
  handler(context: any) {
    const engine = context?.engine
    if (engine) {
      engine.cursor.setType(CursorType.Selection)
    }
  },
})
