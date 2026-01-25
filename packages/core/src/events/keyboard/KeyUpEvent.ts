import { ICustomEvent } from '@sulesky/next-shared'
import { AbstractKeyboardEvent } from './AbstractKeyboardEvent'

export class KeyUpEvent extends AbstractKeyboardEvent implements ICustomEvent {
  type = 'key:up'
}
