import { ICustomEvent } from '@sulesky/next-shared'
import { AbstractCursorEvent } from './AbstractCursorEvent'

export class DragStopEvent extends AbstractCursorEvent implements ICustomEvent {
  type = 'drag:stop'
}
