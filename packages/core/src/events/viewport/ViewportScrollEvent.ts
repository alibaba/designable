import { ICustomEvent } from '@sulesky/next-shared'
import { AbstractViewportEvent } from './AbstractViewportEvent'

export class ViewportScrollEvent
  extends AbstractViewportEvent
  implements ICustomEvent
{
  type = 'viewport:scroll'
}
