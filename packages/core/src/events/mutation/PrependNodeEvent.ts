import { ICustomEvent } from '@sulesky/shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class PrependNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'prepend:node'
}
