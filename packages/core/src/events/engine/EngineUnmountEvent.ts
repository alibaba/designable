import { ICustomEvent } from '@designable/shared'
import { AbstractEngineEvent } from './AbstractEngineEvent'

export class EngineUnmountEvent
  extends AbstractEngineEvent
  implements ICustomEvent
{
  type = 'engine:unmount'
}
