import { EventDriver } from '@designable/shared'
import { KeyDownEvent, KeyUpEvent } from '../events'

function filter(event: KeyboardEvent) {
  const target: any = event.target
  const { tagName } = target
  let flag = true
  // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>
  if (
    target['isContentEditable'] ||
    ((tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') &&
      !target.readOnly)
  ) {
    flag = false
  }
  return flag
}

export class KeyboardDriver extends EventDriver {
  onKeyDown = (e: KeyboardEvent) => {
    if (!filter(e)) return
    this.dispatch(new KeyDownEvent(e))
  }

  onKeyUp = (e: KeyboardEvent) => {
    this.dispatch(new KeyUpEvent(e))
  }

  attach() {
    this.addEventListener('keydown', this.onKeyDown, {
      once: true,
    })
    this.addEventListener('keyup', this.onKeyUp, {
      once: true,
    })
  }

  detach() {
    this.removeEventListener('keydown', this.onKeyDown, {
      once: true,
    })
    this.removeEventListener('keyup', this.onKeyUp, {
      once: true,
    })
  }
}
