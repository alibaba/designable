import { CursorType, KeyCode, Shortcut } from '../models'

export const CursorSwitchSelection = new Shortcut({
  codes: [KeyCode.Shift, KeyCode.S],
  handler(context) {
    const designer = context?.designer
    if (designer) {
      designer.cursor.setType(CursorType.Selection)
    }
  },
})
