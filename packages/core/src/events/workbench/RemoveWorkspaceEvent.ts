import { ICustomEvent } from '@sulesky/next-shared'
import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent'

export class RemoveWorkspaceEvent
  extends AbstractWorkspaceEvent
  implements ICustomEvent
{
  type = 'remove:workspace'
}
