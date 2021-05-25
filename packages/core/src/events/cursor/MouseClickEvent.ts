import { ICustomEvent } from '@designable/shared'
import { AbstractCursorEvent } from './AbstractCursorEvent'

export class MouseClickEvent
  extends AbstractCursorEvent
  implements ICustomEvent
{
  type = 'mouse:click'
}
