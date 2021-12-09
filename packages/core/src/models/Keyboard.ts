import { observable, define, action } from '@formily/reactive'
import { KeyCode } from '@designable/shared'
import { Designer } from './Designer'
import { Shortcut } from './Shortcut'
import { AbstractKeyboardEvent } from '../events/keyboard/AbstractKeyboardEvent'
import { IDesignerContext } from '../types'

const Modifiers: [string, KeyCode][] = [
  ['metaKey', KeyCode.Metadata],
  ['shiftKey', KeyCode.Shift],
  ['ctrlKey', KeyCode.Control],
  ['altKey', KeyCode.Alt],
]

export interface IKeyboard {
  designer: Designer
}

export class Keyboard {
  designer: Designer
  shortcuts: Shortcut[] = []
  sequence: KeyCode[] = []
  keyDown: KeyCode = null
  modifiers = {}
  requestTimer = null

  constructor(designer?: Designer) {
    this.designer = designer
    this.shortcuts = designer.props?.shortcuts || []
    this.makeObservable()
  }

  matchCodes(context: IDesignerContext) {
    for (let i = 0; i < this.shortcuts.length; i++) {
      const shortcut = this.shortcuts[i]
      if (shortcut.match(this.sequence, context)) {
        return true
      }
    }
    return false
  }

  preventCodes() {
    return this.shortcuts.some((shortcut) => {
      return shortcut.preventCodes(this.sequence)
    })
  }

  includes(key: KeyCode) {
    return this.sequence.some((code) => Shortcut.matchCode(code, key))
  }

  excludes(key: KeyCode) {
    this.sequence = this.sequence.filter(
      (code) => !Shortcut.matchCode(key, code)
    )
  }

  addKeyCode(key: KeyCode) {
    if (!this.includes(key)) {
      this.sequence.push(key)
    }
  }

  removeKeyCode(key: KeyCode) {
    if (this.includes(key)) {
      this.excludes(key)
    }
  }

  isModifier(code: KeyCode) {
    return Modifiers.some((modifier) => Shortcut.matchCode(modifier[1], code))
  }

  handleModifiers(event: AbstractKeyboardEvent) {
    Modifiers.forEach(([key, code]) => {
      if (event[key]) {
        if (!this.includes(code)) {
          this.sequence = [code].concat(this.sequence)
        }
      }
    })
  }

  handleKeyboard(event: AbstractKeyboardEvent, context: IDesignerContext) {
    if (event.eventType === 'keydown') {
      this.keyDown = event.data
      this.addKeyCode(this.keyDown)
      this.handleModifiers(event)
      if (this.matchCodes(context)) {
        this.sequence = []
      }
      this.requestClean()
      if (this.preventCodes()) {
        event.preventDefault()
        event.stopPropagation()
      }
    } else {
      this.keyDown = null
    }
  }

  isKeyDown(code: KeyCode) {
    return this.keyDown === code
  }

  requestClean() {
    clearTimeout(this.requestTimer)
    this.requestTimer = setTimeout(() => {
      this.keyDown = null
      this.sequence = []
      clearTimeout(this.requestTimer)
    }, 4000)
  }

  makeObservable() {
    define(this, {
      sequence: observable.shallow,
      keyDown: observable.ref,
      handleKeyboard: action,
    })
  }
}
