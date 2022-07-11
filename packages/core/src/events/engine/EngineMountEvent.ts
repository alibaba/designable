import { ICustomEvent } from '@designable/shared'
import { AbstractEngineEvent } from './AbstractEngineEvent'

export class EngineMountEvent
  extends AbstractEngineEvent
  implements ICustomEvent
{
  type = 'engine:mount'
}
