import { isFn, KeyCode } from '@designable/shared'
import { IEngineContext } from '../types'

export { KeyCode }

export interface IShortcutProps {
  codes?: KeyCode[]
  matcher?: (codes: KeyCode[]) => boolean
  handler?: (context: IEngineContext) => void
}

export class Shortcut {
  codes: KeyCode[]
  handler: (context: IEngineContext) => void
  matcher: (codes: KeyCode[]) => boolean
  constructor(props: IShortcutProps) {
    this.codes = props.codes || []
    this.handler = props.handler
    this.matcher = props.matcher
  }

  preventCodes(codes: KeyCode[]) {
    if (this.codes.length) {
      for (let i = 0; i < codes.length; i++) {
        if (!Shortcut.matchCode(codes[i], this.codes[i])) {
          return false
        }
      }
      return true
    }
    return false
  }

  matched(matched: boolean, context: IEngineContext) {
    if (isFn(this.handler) && matched) {
      this.handler(context)
    }
    return matched
  }

  match(codes: KeyCode[], context: IEngineContext) {
    const sortedSelf = Shortcut.sortCodes(this.codes)
    const sortedTarget: KeyCode[] = Shortcut.sortCodes(codes)
    if (isFn(this.matcher)) {
      return this.matched(this.matcher(sortedTarget), context)
    }
    if (sortedTarget.length !== sortedSelf.length)
      return this.matched(false, context)
    for (let i = 0; i < sortedSelf.length; i++) {
      if (!Shortcut.matchCode(sortedTarget[i], sortedSelf[i])) {
        return this.matched(false, context)
      }
    }
    return this.matched(true, context)
  }

  static matchCode = (code1: KeyCode, code2: KeyCode) => {
    return code1?.toLocaleLowerCase?.() === code2?.toLocaleLowerCase?.()
  }

  static sortCodes = (codes: KeyCode[]): KeyCode[] => {
    return codes.map((code) => code.toLocaleLowerCase()).sort() as any
  }
}
